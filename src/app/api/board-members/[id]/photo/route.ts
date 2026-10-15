import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function mediaType(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index])) return 'image/png';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const member = await db.boardMember.findUnique({ where: { id }, select: { isPublished: true, photoData: true, photoMediaType: true } });
  if (!member?.photoData || !member.photoMediaType) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  if (!member.isPublished && !(await requireAdmin(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(new Uint8Array(member.photoData), { headers: { 'Content-Type': member.photoMediaType, 'Content-Disposition': 'inline; filename="board-member-photo"', 'Cache-Control': member.isPublished ? 'public, max-age=86400' : 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rejected = enforceMutationRequest(request, { requireJson: false });
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const photo = (await request.formData()).get('photo');
    if (!(photo instanceof File) || photo.size === 0 || photo.size > MAX_PHOTO_BYTES) return NextResponse.json({ error: 'Upload a JPEG, PNG, or WebP image up to 5 MB.' }, { status: 400 });
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const type = mediaType(bytes);
    if (!type) return NextResponse.json({ error: 'Only valid JPEG, PNG, and WebP images are accepted.' }, { status: 400 });
    await db.boardMember.update({ where: { id: (await params).id }, data: { photoData: Buffer.from(bytes), photoMediaType: type, photoUpdatedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to upload photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rejected = enforceMutationRequest(request, { requireJson: false });
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await db.boardMember.update({ where: { id: (await params).id }, data: { photoData: null, photoMediaType: '', photoUpdatedAt: null } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to remove photo' }, { status: 500 });
  }
}
