import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  name:         z.string().min(2).optional(),
  specialty:    z.string().min(2).optional(),
  city:         z.string().min(1).optional(),
  country:      z.string().min(1).optional(),
  location:     z.string().optional(),
  phone:        z.string().optional(),
  email:        z.string().optional(),
  bio:          z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
  isActive:     z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    const { id } = await params;
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.osteopath.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
