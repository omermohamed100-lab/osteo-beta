import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { enforceMutationRequest } from '@/lib/request-security';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rejected = enforceMutationRequest(request, { requireJson: false });
    if (rejected) return rejected;
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await db.$transaction(async (transaction) => {
      const application = await transaction.practitionerApplication.findUnique({ where: { id } });
      if (!application) return { kind: 'missing' as const };
      if (application.applicationType !== 'new_listing') return { kind: 'manual' as const };
      if (application.draftOsteopathId) {
        return { kind: 'success' as const, draftOsteopathId: application.draftOsteopathId };
      }

      const existingProfile = await transaction.osteopath.findFirst({
        where: { email: { equals: application.email, mode: 'insensitive' } },
        select: { id: true },
      });
      if (existingProfile) return { kind: 'duplicate' as const, profileId: existingProfile.id };

      const draft = await transaction.osteopath.create({
        data: {
          name: application.name,
          nameAr: application.nameAr,
          specialty: application.specialty,
          specialtyAr: application.specialtyAr,
          city: application.city,
          cityAr: application.cityAr,
          country: application.country,
          countryAr: application.countryAr,
          location: application.location,
          locationAr: application.locationAr,
          phone: application.phone,
          email: application.email,
          bio: application.bio,
          bioAr: application.bioAr,
          // The submitted URL is review evidence. Move an approved photo into
          // managed website media before activating the directory profile.
          profileImage: null,
          credentialType: application.credentialType,
          credentialTypeAr: application.credentialTypeAr,
          credentialNumber: application.credentialNumber,
          credentialIssuer: application.credentialIssuer,
          credentialIssuerAr: application.credentialIssuerAr,
          credentialStatus: 'unverified',
          credentialVerifiedAt: null,
          credentialExpiresAt: application.credentialExpiresAt,
          profileReviewedAt: null,
          isActive: false,
        },
      });

      await transaction.practitionerApplication.update({
        where: { id },
        data: {
          status: 'approved',
          reviewedAt: new Date(),
          draftOsteopathId: draft.id,
        },
      });
      return { kind: 'success' as const, draftOsteopathId: draft.id };
    });

    if (result.kind === 'missing') {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    if (result.kind === 'manual') {
      return NextResponse.json({ error: 'Profile updates require manual comparison and must not overwrite a live profile.' }, { status: 409 });
    }
    if (result.kind === 'duplicate') {
      return NextResponse.json({ error: 'A profile with this email already exists. Review it manually before changing anything.', profileId: result.profileId }, { status: 409 });
    }
    return NextResponse.json({ success: true, draftOsteopathId: result.draftOsteopathId });
  } catch {
    return NextResponse.json({ error: 'The inactive draft could not be created' }, { status: 500 });
  }
}
