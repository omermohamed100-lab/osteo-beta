import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  PRACTITIONER_APPLICATION_BODY_MAX_BYTES,
  PRACTITIONER_APPLICATION_DEDUPE_WINDOW_MS,
  practitionerApplicationSchema,
} from '@/lib/practitioner-application';
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

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await db.practitionerApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 250,
      include: {
        draftOsteopath: { select: { id: true, name: true, isActive: true } },
      },
    });
    return NextResponse.json(applications, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    return NextResponse.json({ error: 'Applications are temporarily unavailable' }, { status: 500 });
  }
}

function acceptedResponse(status = 201) {
  return NextResponse.json({ success: true, receiptStatus: 'received' }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const body = await readBoundedJsonBody(request, PRACTITIONER_APPLICATION_BODY_MAX_BYTES);
    const data = practitionerApplicationSchema.parse(body);
    if (data.website) return acceptedResponse(202);

    try {
      await cleanupExpiredRateLimits();
      const [addressLimit, emailLimit] = await Promise.all([
        consumeRateLimit({
          scope: 'practitioner-application-address',
          key: getClientAddress(request),
          limit: 4,
          windowMs: 60 * 60 * 1000,
        }),
        consumeRateLimit({
          scope: 'practitioner-application-email',
          key: normalizeRateLimitIdentity(data.email),
          limit: 3,
          windowMs: 24 * 60 * 60 * 1000,
        }),
      ]);
      const blocked = [addressLimit, emailLimit]
        .filter((result) => !result.allowed)
        .sort((a, b) => b.retryAfterSeconds - a.retryAfterSeconds)[0];
      if (blocked) return rateLimitExceededResponse(blocked.retryAfterSeconds);
    } catch {
      return rateLimitUnavailableResponse();
    }

    const duplicate = await db.practitionerApplication.findFirst({
      where: {
        email: data.email,
        applicationType: data.applicationType,
        createdAt: { gte: new Date(Date.now() - PRACTITIONER_APPLICATION_DEDUPE_WINDOW_MS) },
      },
      select: { id: true },
    });
    if (duplicate) return acceptedResponse(202);

    await db.practitionerApplication.create({
      data: {
        applicationType: data.applicationType,
        name: data.name,
        nameAr: data.nameAr,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        specialtyAr: data.specialtyAr,
        city: data.city,
        cityAr: data.cityAr,
        country: data.country,
        countryAr: data.countryAr,
        location: data.location,
        locationAr: data.locationAr,
        bio: data.bio,
        bioAr: data.bioAr,
        profileImage: data.profileImage || null,
        credentialType: data.credentialType,
        credentialTypeAr: data.credentialTypeAr,
        credentialNumber: data.credentialNumber,
        credentialIssuer: data.credentialIssuer,
        credentialIssuerAr: data.credentialIssuerAr,
        credentialIssuedAt: data.credentialIssuedAt,
        credentialExpiresAt: data.credentialExpiresAt,
        existingProfileUrl: data.existingProfileUrl,
        applicantNotes: data.applicantNotes,
        consentAccuracy: data.consentAccuracy,
        consentPrivacy: data.consentPrivacy,
      },
    });

    return acceptedResponse();
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please check the application fields', details: error.issues }, { status: 400 });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      || error instanceof Prisma.PrismaClientUnknownRequestError
      || error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json({ error: 'Application service is temporarily unavailable' }, { status: 503 });
    }
    console.error('Practitioner application could not be processed.');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
