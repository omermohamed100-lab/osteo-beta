import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const updateSchema = z.object({
  title:       z.string().min(2).optional(),
  titleAr:     z.string().optional(),
  description: z.string().min(5).optional(),
  descriptionAr: z.string().optional(),
  date:        z.string().transform((s) => new Date(s)).optional(),
  location:    z.string().min(1).optional(),
  locationAr:  z.string().optional(),
  imageUrl:    mediaUrlSchema.optional().or(z.literal('')),
  isActive:    z.boolean().optional(),
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

    const activity = await db.activity.update({ where: { id }, data: updateData });
    return NextResponse.json(activity);
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

    await db.activity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
