import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const activitySchema = z.object({
  title:       z.string().min(2),
  description: z.string().min(5),
  date:        z.string().transform((s) => new Date(s)),
  location:    z.string().min(1),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  isActive:    z.boolean().default(true),
});

export async function GET() {
  try {
    const activities = await db.activity.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = activitySchema.parse(body);

    const activity = await db.activity.create({ data });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
