import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const updateSchema = z.object({
  name:         z.string().min(2).optional(),
  nameAr:       z.string().optional(),
  specialty:    z.string().min(2).optional(),
  specialtyAr:  z.string().optional(),
  city:         z.string().min(1).optional(),
  cityAr:       z.string().optional(),
  country:      z.string().min(1).optional(),
  countryAr:    z.string().optional(),
  location:     z.string().optional(),
  locationAr:   z.string().optional(),
  phone:        z.string().optional(),
  email:        z.string().optional(),
  bio:          z.string().optional(),
  bioAr:        z.string().optional(),
  profileImage: mediaUrlSchema.optional().or(z.literal('')),
  credentialType: z.string().optional(),
  credentialTypeAr: z.string().optional(),
  credentialNumber: z.string().optional(),
  credentialIssuer: z.string().optional(),
  credentialIssuerAr: z.string().optional(),
  credentialStatus: z.enum(['unverified', 'verified', 'expired']).optional(),
  credentialVerifiedAt: z.string().optional().transform((value) => value === undefined ? undefined : value ? new Date(value) : null),
  credentialExpiresAt: z.string().optional().transform((value) => value === undefined ? undefined : value ? new Date(value) : null),
  profileReviewedAt: z.string().optional().transform((value) => value === undefined ? undefined : value ? new Date(value) : null),
  isActive:     z.boolean().optional(),
}).superRefine((data, context) => {
  if (data.credentialStatus !== 'verified') return;
  for (const field of ['credentialType', 'credentialNumber', 'credentialIssuer'] as const) {
    if (!data[field]?.trim()) {
      context.addIssue({ code: 'custom', path: [field], message: 'Required for a verified credential' });
    }
  }
  if (!data.credentialVerifiedAt || Number.isNaN(data.credentialVerifiedAt.getTime())) {
    context.addIssue({ code: 'custom', path: ['credentialVerifiedAt'], message: 'A valid verification date is required' });
  }
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const { id } = await params;
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = updateSchema.parse(body);
    const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));

    const osteopath = await db.osteopath.update({ where: { id }, data: updateData });
    return NextResponse.json(osteopath);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rejected = enforceMutationRequest(request, { requireJson: false });
    if (rejected) return rejected;

    const { id } = await params;
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.osteopath.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
