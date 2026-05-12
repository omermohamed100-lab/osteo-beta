import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  instructor: z.string().min(2),
  duration: z.string().min(2),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  price: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
