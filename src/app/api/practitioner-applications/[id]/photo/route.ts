import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const photo = await db.practitionerApplication.findUnique({ where: { id: (await params).id }, select: { photoData: true, photoMediaType: true } });
  if (!photo?.photoData || !photo.photoMediaType) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  return new NextResponse(new Uint8Array(photo.photoData), { headers: { 'Content-Type': photo.photoMediaType, 'Content-Disposition': 'inline; filename="application-photo"', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}
