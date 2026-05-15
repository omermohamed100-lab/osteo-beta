import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = await db.user.findMany({ select: { email: true, role: true } });
  return NextResponse.json({ users, dbUrl: process.env.DATABASE_URL?.slice(0, 40) + '...' });
}
