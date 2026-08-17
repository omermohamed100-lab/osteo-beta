import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAdmin, setAdminSessionCookie, signJWT } from '@/lib/auth';
import { enforceMutationRequest } from '@/lib/request-security';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, { message: 'Current password is required to set a new password' });

export async function PATCH(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = updateSchema.parse(body);

    const user = await db.user.findUnique({ where: { id: admin.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (data.newPassword) {
      const valid = await bcrypt.compare(data.currentPassword!, user.password);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.newPassword && { password: await bcrypt.hash(data.newPassword, 10) }),
        ...(data.newPassword && { sessionVersion: { increment: 1 } }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sessionVersion: true,
      },
    });

    const response = NextResponse.json({
      user: { id: updated.id, name: updated.name, email: updated.email },
    });

    if (data.newPassword) {
      const token = await signJWT({
        id: updated.id,
        email: updated.email,
        role: updated.role,
        sessionVersion: updated.sessionVersion,
      });
      setAdminSessionCookie(response, token);
    }

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
