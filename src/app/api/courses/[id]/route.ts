import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  titleAr: z.string().optional(),
  description: z.string().min(10).optional(),
  descriptionAr: z.string().optional(),
  instructor: z.string().min(2).optional(),
  instructorAr: z.string().optional(),
  duration: z.string().min(2).optional(),
  durationAr: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().optional().transform((str) => str === undefined ? undefined : str ? new Date(str) : null),
  price: z.number().nonnegative().nullable().optional(),
  priceCurrency: z.union([z.literal(''), z.string().regex(/^[A-Z]{3}$/)]).optional(),
  imageUrl: mediaUrlSchema.optional().or(z.literal('')),
  isActive: z.boolean().optional(),
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
    const data = updateCourseSchema.parse(body);

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    const course = await db.course.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(course);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 });
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

    await db.course.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
