import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { requireAdmin } from '@/lib/auth';
import {
  CONTACT_BODY_MAX_BYTES,
  CONTACT_DEDUPE_WINDOW_MS,
  contactSubmissionSchema,
  createContactDedupeKey,
} from '@/lib/contact-security';
import {
  cleanupExpiredRateLimits,
  consumeRateLimit,
  getClientAddress,
  normalizeRateLimitIdentity,
  rateLimitExceededResponse,
  rateLimitUnavailableResponse,
} from '@/lib/rate-limit';
import {
  enforceMutationRequest,
  InvalidJsonBodyError,
  readBoundedJsonBody,
  RequestBodyTooLargeError,
} from '@/lib/request-security';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function acceptedResponse(status = 201) {
  return NextResponse.json({ success: true, receiptStatus: 'received' }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const body = await readBoundedJsonBody(request, CONTACT_BODY_MAX_BYTES);
    const data = contactSubmissionSchema.parse(body);

    // Bots commonly fill fields hidden from people. Return the normal receipt shape
    // without storing data or revealing that the trap was detected.
    if (data.website) return acceptedResponse(202);

    try {
      await cleanupExpiredRateLimits();
      const [addressLimit, emailLimit] = await Promise.all([
        consumeRateLimit({
          scope: 'contact-address',
          key: getClientAddress(request),
          limit: 5,
          windowMs: 60 * 60 * 1000,
        }),
        consumeRateLimit({
          scope: 'contact-email',
          key: normalizeRateLimitIdentity(data.email),
          limit: 3,
          windowMs: 60 * 60 * 1000,
        }),
      ]);
      const blocked = [addressLimit, emailLimit]
        .filter((result) => !result.allowed)
        .sort((a, b) => b.retryAfterSeconds - a.retryAfterSeconds)[0];
      if (blocked) return rateLimitExceededResponse(blocked.retryAfterSeconds);
    } catch {
      return rateLimitUnavailableResponse();
    }

    const now = new Date();
    const dedupeKeyHash = createContactDedupeKey(data);

    await db.contactSubmissionDedupe.deleteMany({
      where: { expiresAt: { lte: now } },
    });

    const submission = await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        subject: 'Website Contact Form',
        message: data.message,
        dedupeReservation: {
          create: {
            keyHash: dedupeKeyHash,
            expiresAt: new Date(now.getTime() + CONTACT_DEDUPE_WINDOW_MS),
          },
        },
      },
    });

    let deliveryResult: Awaited<ReturnType<typeof sendEmail>> = {
      success: false,
      reason: 'transport',
    };
    try {
      const settings = await db.siteSettings.findUnique({ where: { id: 'global' } });
      deliveryResult = await sendEmail({
        to: settings?.email ?? '',
        subject: 'New website contact submission',
        text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
      });
    } catch {
      // The database receipt remains authoritative even when notification lookup fails.
    }

    const attemptedAt = new Date();
    try {
      await db.contactSubmission.update({
        where: { id: submission.id },
        data: {
          notificationStatus: deliveryResult.success ? 'sent' : 'failed',
          notificationAttempts: { increment: 1 },
          notificationLastAttemptedAt: attemptedAt,
          ...(deliveryResult.success && { notificationSentAt: attemptedAt }),
        },
      });
    } catch {
      console.error('Contact notification status could not be recorded.');
    }

    if (!deliveryResult.success) {
      console.error(`Contact notification failed (${deliveryResult.reason}).`);
    }

    return acceptedResponse();
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return acceptedResponse(202);
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      || error instanceof Prisma.PrismaClientUnknownRequestError
      || error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json(
        { error: 'Contact service is temporarily unavailable' },
        { status: 503 },
      );
    }
    console.error('Contact submission could not be processed.');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
