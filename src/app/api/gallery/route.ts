import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const gallerySchema = z.object({
  imageUrl: mediaUrlSchema,
  caption:  z.string().default(''),
  captionAr: z.string().default(''),
  category: z.string().default('General'),
  categoryAr: z.string().default(''),
});

export async function GET() {
  try {
    const items = await db.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch {
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
    const data = gallerySchema.parse(body);

    const item = await db.galleryItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
