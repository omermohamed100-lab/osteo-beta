import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const osteopathSchema = z.object({
  name:         z.string().min(2),
  specialty:    z.string().min(2),
  city:         z.string().min(1),
  country:      z.string().min(1).default('Egypt'),
  location:     z.string().default(''),
  phone:        z.string().default(''),
  email:        z.string().default(''),
  bio:          z.string().default(''),
  profileImage: z.string().url().optional().or(z.literal('')),
  isActive:     z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name    = searchParams.get('name')    ?? '';
    const city    = searchParams.get('city')    ?? '';
    const country = searchParams.get('country') ?? '';

    const osteopaths = await db.osteopath.findMany({
      where: {
        isActive: true,
        ...(name    ? { name:    { contains: name,    } } : {}),
        ...(city    ? { city:    { contains: city,    } } : {}),
        ...(country ? { country: { contains: country, } } : {}),
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(osteopaths);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = osteopathSchema.parse(body);

    const osteopath = await db.osteopath.create({ data });
    return NextResponse.json(osteopath, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
