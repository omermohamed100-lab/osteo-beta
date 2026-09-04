import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { COURSE_INTEREST_BODY_MAX_BYTES, courseInterestSchema } from '@/lib/course-interest';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { cleanupExpiredRateLimits, consumeRateLimit, getClientAddress, normalizeRateLimitIdentity, rateLimitExceededResponse, rateLimitUnavailableResponse } from '@/lib/rate-limit';
import { enforceMutationRequest, InvalidJsonBodyError, readBoundedJsonBody, RequestBodyTooLargeError } from '@/lib/request-security';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const interests = await db.courseInterest.findMany({ orderBy: { createdAt: 'desc' }, take: 250 });
    return NextResponse.json(interests, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ error: 'Course interests are temporarily unavailable' }, { status: 500 });
  }
}

const acceptedResponse = (status = 201) => NextResponse.json({ success: true, receiptStatus: 'received' }, { status });

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;
    const data = courseInterestSchema.parse(await readBoundedJsonBody(request, COURSE_INTEREST_BODY_MAX_BYTES));
    if (data.website) return acceptedResponse(202);

    try {
      await cleanupExpiredRateLimits();
      const limits = await Promise.all([
        consumeRateLimit({ scope: 'course-interest-address', key: getClientAddress(request), limit: 5, windowMs: 60 * 60 * 1000 }),
        consumeRateLimit({ scope: 'course-interest-email', key: normalizeRateLimitIdentity(data.email), limit: 3, windowMs: 24 * 60 * 60 * 1000 }),
      ]);
      const blocked = limits.filter((result) => !result.allowed).sort((a, b) => b.retryAfterSeconds - a.retryAfterSeconds)[0];
      if (blocked) return rateLimitExceededResponse(blocked.retryAfterSeconds);
    } catch {
      return rateLimitUnavailableResponse();
    }

    // The durable receipt is authoritative and must exist before notification is attempted.
    const interest = await db.courseInterest.create({ data: { email: data.email, topic: data.topic, consentNotifications: data.consentNotifications } });
    let delivery: Awaited<ReturnType<typeof sendEmail>> = { success: false, reason: 'transport' };
    try {
      const settings = await db.siteSettings.findUnique({ where: { id: 'global' } });
      delivery = await sendEmail({
        to: settings?.email ?? '',
        subject: 'New course notification request',
        text: `Email: ${data.email}\nTopic preference: ${data.topic || 'Not provided'}\nConsent to course notifications: yes`,
      });
    } catch { /* The database receipt remains authoritative. */ }
    try {
      const attemptedAt = new Date();
      await db.courseInterest.update({ where: { id: interest.id }, data: { notificationStatus: delivery.success ? 'sent' : 'failed', notificationAttempts: { increment: 1 }, notificationLastAttemptedAt: attemptedAt, ...(delivery.success && { notificationSentAt: attemptedAt }) } });
    } catch { console.error('Course interest notification status could not be recorded.'); }
    if (!delivery.success) console.error(`Course interest notification failed (${delivery.reason}).`);
    return acceptedResponse();
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    if (error instanceof InvalidJsonBodyError) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientUnknownRequestError || error instanceof Prisma.PrismaClientInitializationError) return NextResponse.json({ error: 'Course interest service is temporarily unavailable' }, { status: 503 });
    console.error('Course interest could not be processed.');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
