import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { approvedOsteopaths } from '@/data/approved-osteopaths';
import { z } from 'zod';

const osteopathSchema = z.object({
  name:         z.string().min(2),
  nameAr:       z.string().default(''),
  specialty:    z.string().min(2),
  specialtyAr:  z.string().default(''),
  city:         z.string().min(1),
  cityAr:       z.string().default(''),
  country:      z.string().min(1).default('Egypt'),
  countryAr:    z.string().default(''),
  location:     z.string().default(''),
  locationAr:   z.string().default(''),
  phone:        z.string().default(''),
  email:        z.string().default(''),
  bio:          z.string().default(''),
  bioAr:        z.string().default(''),
  profileImage: mediaUrlSchema.optional().or(z.literal('')),
  credentialType: z.string().default(''),
  credentialTypeAr: z.string().default(''),
  credentialNumber: z.string().default(''),
  credentialIssuer: z.string().default(''),
  credentialIssuerAr: z.string().default(''),
  credentialStatus: z.enum(['unverified', 'verified', 'expired']).default('unverified'),
  credentialVerifiedAt: z.string().optional().transform((value) => value ? new Date(value) : null),
  credentialExpiresAt: z.string().optional().transform((value) => value ? new Date(value) : null),
  profileReviewedAt: z.string().optional().transform((value) => value ? new Date(value) : null),
  isActive:     z.boolean().default(true),
}).superRefine((data, context) => {
  if (data.credentialStatus !== 'verified') return;
  for (const field of ['credentialType', 'credentialNumber', 'credentialIssuer'] as const) {
    if (!data[field].trim()) {
      context.addIssue({ code: 'custom', path: [field], message: 'Required for a verified credential' });
    }
  }
  if (!data.credentialVerifiedAt || Number.isNaN(data.credentialVerifiedAt.getTime())) {
    context.addIssue({ code: 'custom', path: ['credentialVerifiedAt'], message: 'A valid verification date is required' });
  }
});

export async function GET(request: NextRequest) {
  const publicRequest = request.nextUrl.searchParams.get('public') === '1';
  const adminRequest = request.nextUrl.searchParams.get('admin') === '1';

  try {
    if (adminRequest && !(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const name    = searchParams.get('name')    ?? '';
    const city    = searchParams.get('city')    ?? '';
    const country = searchParams.get('country') ?? '';

    const osteopaths = await db.osteopath.findMany({
      where: {
        ...(adminRequest ? {} : { isActive: true }),
        ...(name    ? { name:    { contains: name,    } } : {}),
        ...(city    ? { city:    { contains: city,    } } : {}),
        ...(country ? { country: { contains: country, } } : {}),
      },
      orderBy: { name: 'asc' },
    });
    if (publicRequest) {
      const listedEmails = new Set(osteopaths.map((osteopath) => osteopath.email.toLowerCase()));
      return NextResponse.json([
        ...osteopaths,
        ...approvedOsteopaths.filter((osteopath) => !listedEmails.has(osteopath.email.toLowerCase())),
      ]);
    }

    if (adminRequest) {
      const listedEmails = new Set(osteopaths.map((osteopath) => osteopath.email.toLowerCase()));
      const approvedFallbacks = approvedOsteopaths
        .filter((osteopath) => !listedEmails.has(osteopath.email.toLowerCase()))
        .map((osteopath) => ({
          ...osteopath,
          nameAr: osteopath.nameAr ?? '',
          specialtyAr: osteopath.specialtyAr ?? '',
          cityAr: osteopath.cityAr ?? '',
          countryAr: osteopath.countryAr ?? '',
          locationAr: osteopath.locationAr ?? '',
          bioAr: osteopath.bioAr ?? '',
          credentialType: osteopath.credentialType ?? '',
          credentialTypeAr: osteopath.credentialTypeAr ?? '',
          credentialNumber: osteopath.credentialNumber ?? '',
          credentialIssuer: osteopath.credentialIssuer ?? '',
          credentialIssuerAr: osteopath.credentialIssuerAr ?? '',
          credentialStatus: osteopath.credentialStatus ?? 'unverified',
          credentialVerifiedAt: osteopath.credentialVerifiedAt ?? null,
          credentialExpiresAt: osteopath.credentialExpiresAt ?? null,
          profileReviewedAt: osteopath.profileReviewedAt ?? null,
          isActive: true,
          recordSource: 'approved-fallback' as const,
        }));

      return NextResponse.json([
        ...osteopaths.map((osteopath) => ({ ...osteopath, recordSource: 'database' as const })),
        ...approvedFallbacks,
      ].sort((a, b) => a.name.localeCompare(b.name)));
    }

    return NextResponse.json(osteopaths);
  } catch {
    if (publicRequest) {
      // Keep the approved public directory available during a database outage.
      return NextResponse.json(approvedOsteopaths, {
        headers: { 'x-egsom-data-status': 'unavailable' },
      });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = osteopathSchema.parse(body);

    const osteopath = await db.osteopath.create({ data });
    return NextResponse.json(osteopath, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
