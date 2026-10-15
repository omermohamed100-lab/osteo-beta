import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { socialUrlSchema } from '@/lib/url-security';

const boardMemberSchema = z.object({
  name: z.string().trim().min(2).max(160),
  nameAr: z.string().trim().min(2).max(160),
  position: z.string().trim().min(2).max(160),
  positionAr: z.string().trim().min(2).max(160),
  biography: z.string().trim().max(4000).default(''),
  biographyAr: z.string().trim().max(4000).default(''),
  email: z.union([z.literal(''), z.string().email()]).default(''),
  linkedin: socialUrlSchema(['linkedin.com']).default(''),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const adminRequest = request.nextUrl.searchParams.get('admin') === '1';
    if (adminRequest && !(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const members = await db.boardMember.findMany({
      where: adminRequest ? undefined : { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true, name: true, nameAr: true, position: true, positionAr: true, biography: true, biographyAr: true,
        email: true, linkedin: true, sortOrder: true, isPublished: true, photoUpdatedAt: true, createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json(members.map((member) => ({ ...member, photoUrl: member.photoUpdatedAt ? `/api/board-members/${member.id}/photo?v=${member.photoUpdatedAt.getTime()}` : null })));
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const member = await db.boardMember.create({ data: boardMemberSchema.parse(await request.json()) });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid board member data', details: error.issues }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
