import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { practitionerApplicationReviewSchema } from '@/lib/practitioner-application';
import {
  enforceMutationRequest,
  InvalidJsonBodyError,
  readBoundedJsonBody,
  RequestBodyTooLargeError,
} from '@/lib/request-security';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await readBoundedJsonBody(request, 8 * 1024);
    const data = practitionerApplicationReviewSchema.parse(body);
    const application = await db.practitionerApplication.update({
      where: { id },
      data: {
        status: data.status,
        reviewNotes: data.reviewNotes,
        reviewedAt: data.status === 'pending' ? null : new Date(),
      },
      include: {
        draftOsteopath: { select: { id: true, name: true, isActive: true } },
      },
    });
    return NextResponse.json(application);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError || error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'The review could not be saved' }, { status: 500 });
  }
}
