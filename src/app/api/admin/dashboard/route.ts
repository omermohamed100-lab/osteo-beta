import { NextRequest, NextResponse } from 'next/server';
import { approvedOsteopaths } from '@/data/approved-osteopaths';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [courses, databaseOsteopaths, activities, gallery, messages] =
      await db.$transaction([
        db.course.count({ where: { isActive: true } }),
        db.osteopath.findMany({
          where: { isActive: true },
          select: { email: true },
        }),
        db.activity.count({ where: { isActive: true } }),
        db.galleryItem.count(),
        db.contactSubmission.count(),
      ]);

    const listedEmails = new Set(
      databaseOsteopaths.map((osteopath) => osteopath.email.toLowerCase()),
    );
    const approvedProfilesNotInDatabase = approvedOsteopaths.filter(
      (osteopath) => !listedEmails.has(osteopath.email.toLowerCase()),
    ).length;

    return NextResponse.json(
      {
        courses,
        osteopaths: databaseOsteopaths.length + approvedProfilesNotInDatabase,
        activities,
        gallery,
        messages,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Dashboard totals are temporarily unavailable' },
      { status: 500 },
    );
  }
}
