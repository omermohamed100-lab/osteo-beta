import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { mediaUrlSchema } from '@/lib/url-security';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(3),
  titleAr: z.string().default(''),
  description: z.string().min(10),
  descriptionAr: z.string().default(''),
  instructor: z.string().min(2),
  instructorAr: z.string().default(''),
  duration: z.string().min(2),
  durationAr: z.string().default(''),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  price: z.number().nonnegative().nullable().optional(),
  priceCurrency: z.union([z.literal(''), z.string().regex(/^[A-Z]{3}$/)]).default(''),
  imageUrl: mediaUrlSchema.optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const adminRequest = request.nextUrl.searchParams.get('admin') === '1';
    if (adminRequest && !(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const courses = await db.course.findMany({
      where: adminRequest ? undefined : { isActive: true },
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json(courses);
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
    const data = courseSchema.parse(body);

    const course = await db.course.create({
      data,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
