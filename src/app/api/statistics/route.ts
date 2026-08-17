import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { enforceMutationRequest } from '@/lib/request-security';
import { statisticSchema } from '@/lib/statistics';

export async function GET(request: NextRequest) {
  try {
    const adminRequest = request.nextUrl.searchParams.get('admin') === '1';
    if (adminRequest) {
      const admin = await requireAdmin(request);
      if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const statistics = await db.publicStatistic.findMany({
      where: adminRequest ? undefined : { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      take: adminRequest ? 100 : 8,
    });
    return NextResponse.json(statistics);
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

    const data = statisticSchema.parse(await request.json());
    const statistic = await db.publicStatistic.create({ data });
    return NextResponse.json(statistic, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
