import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { socialUrlSchema } from '@/lib/url-security';

const updateSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(), nameAr: z.string().trim().min(2).max(160).optional(),
  position: z.string().trim().min(2).max(160).optional(), positionAr: z.string().trim().min(2).max(160).optional(),
  biography: z.string().trim().max(4000).optional(), biographyAr: z.string().trim().max(4000).optional(),
  email: z.union([z.literal(''), z.string().email()]).optional(), linkedin: socialUrlSchema(['linkedin.com']).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(), isPublished: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = updateSchema.parse(await request.json());
    const member = await db.boardMember.update({ where: { id: (await params).id }, data });
    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid board member data', details: error.issues }, { status: 400 });
    return NextResponse.json({ error: 'Unable to update board member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rejected = enforceMutationRequest(request, { requireJson: false });
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await db.boardMember.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to delete board member' }, { status: 500 });
  }
}
