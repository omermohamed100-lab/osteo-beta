import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { socialUrlSchema } from '@/lib/url-security';
import { siteSettingsDefaults, isValidPublicPath } from '@/lib/site-settings';
import { z } from 'zod';

const settingsSchema = z.object({
  phone: z.string().optional(),
  email: z.union([z.literal(''), z.string().email()]).optional(),
  address: z.string().optional(),
  addressAr: z.string().optional(),
  facebook: socialUrlSchema(['facebook.com']).optional(),
  instagram: socialUrlSchema(['instagram.com']).optional(),
  linkedin: socialUrlSchema(['linkedin.com']).optional(),
  youtube: socialUrlSchema(['youtube.com', 'youtu.be']).optional(),
  x: socialUrlSchema(['x.com', 'twitter.com']).optional(),
  whatsapp: z.string().trim().regex(/^$|^\+?[0-9 ()-]{8,24}$/, 'Enter a valid international WhatsApp number').optional(),
  facebookEnabled: z.boolean().optional(),
  youtubeEnabled: z.boolean().optional(),
  linkedinEnabled: z.boolean().optional(),
  xEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  facebookOrder: z.number().int().min(0).max(99).optional(),
  youtubeOrder: z.number().int().min(0).max(99).optional(),
  linkedinOrder: z.number().int().min(0).max(99).optional(),
  xOrder: z.number().int().min(0).max(99).optional(),
  whatsappOrder: z.number().int().min(0).max(99).optional(),
  heroEyebrow: z.string().trim().min(1).max(160).optional(),
  heroEyebrowAr: z.string().trim().min(1).max(160).optional(),
  heroHeadline: z.string().trim().min(1).max(240).optional(),
  heroHeadlineAr: z.string().trim().min(1).max(240).optional(),
  heroDescription: z.string().trim().min(1).max(1000).optional(),
  heroDescriptionAr: z.string().trim().min(1).max(1000).optional(),
  heroPrimaryLabel: z.string().trim().min(1).max(80).optional(),
  heroPrimaryLabelAr: z.string().trim().min(1).max(80).optional(),
  heroPrimaryHref: z.string().refine(isValidPublicPath, 'Choose an internal public destination').optional(),
  heroSecondaryLabel: z.string().trim().min(1).max(80).optional(),
  heroSecondaryLabelAr: z.string().trim().min(1).max(80).optional(),
  heroSecondaryHref: z.string().refine(isValidPublicPath, 'Choose an internal public destination').optional(),
});

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json(settings ?? { id: 'global', ...siteSettingsDefaults });
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
        ...siteSettingsDefaults,
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
