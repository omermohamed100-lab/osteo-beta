import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { socialUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const settingsSchema = z.object({
  phone: z.string().optional(),
  email: z.union([z.literal(''), z.string().email()]).optional(),
  address: z.string().optional(),
  addressAr: z.string().optional(),
  facebook: socialUrlSchema(['facebook.com']).optional(),
  instagram: socialUrlSchema(['instagram.com']).optional(),
  linkedin: socialUrlSchema(['linkedin.com']).optional(),
});

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = settingsSchema.parse(body);

    const settings = await db.siteSettings.upsert({
      where: { id: 'global' },
      update: data,
      create: {
        id: 'global',
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
