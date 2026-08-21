import type { Osteopath } from '@prisma/client';
import { approvedOsteopaths, type ApprovedOsteopath } from '@/data/approved-osteopaths';
import { db } from '@/lib/db';

type StoredOsteopath = Osteopath & {
  nameAr: string;
  cityAr: string;
  countryAr: string;
  credentialTypeAr: string;
  credentialIssuerAr: string;
};

export type PublicOsteopathProfile = Omit<
  ApprovedOsteopath,
  'profileImage' | 'credentialVerifiedAt' | 'credentialExpiresAt' | 'profileReviewedAt'
> & {
  profileImage: string | null;
  nameAr?: string;
  specialtyAr?: string;
  cityAr?: string;
  countryAr?: string;
  locationAr?: string;
  bioAr?: string;
  credentialType?: string;
  credentialTypeAr?: string;
  credentialNumber?: string;
  credentialIssuer?: string;
  credentialIssuerAr?: string;
  credentialStatus?: string;
  credentialVerifiedAt?: Date | string | null;
  credentialExpiresAt?: Date | string | null;
  profileReviewedAt?: Date | string | null;
};

function toPublicProfile(profile: StoredOsteopath | ApprovedOsteopath): PublicOsteopathProfile {
  return profile;
}

export async function getPublicOsteopathProfile(id: string): Promise<{
  data: PublicOsteopathProfile | null;
  unavailable: boolean;
}> {
  const approvedProfile = approvedOsteopaths.find((profile) => profile.id === id) ?? null;

  try {
    const databaseProfile = await db.osteopath.findFirst({
      where: { id, isActive: true },
    });
    return {
      data: databaseProfile ? toPublicProfile(databaseProfile as StoredOsteopath) : approvedProfile,
      unavailable: false,
    };
  } catch {
    return {
      data: approvedProfile,
      unavailable: true,
    };
  }
}
