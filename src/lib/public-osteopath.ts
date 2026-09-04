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

export type PublicDirectoryOsteopath = Pick<
  PublicOsteopathProfile,
  | 'id'
  | 'name'
  | 'nameAr'
  | 'specialty'
  | 'specialtyAr'
  | 'city'
  | 'cityAr'
  | 'country'
  | 'countryAr'
  | 'location'
  | 'locationAr'
  | 'phone'
  | 'email'
  | 'bio'
  | 'bioAr'
  | 'profileImage'
  | 'directoryCities'
  | 'directoryCitiesAr'
>;

function toPublicProfile(profile: StoredOsteopath | ApprovedOsteopath): PublicOsteopathProfile {
  return profile;
}

export function withApprovedDirectoryLocations<
  T extends { email: string; directoryCities?: string[]; directoryCitiesAr?: string[] },
>(profile: T): T & { directoryCities?: string[]; directoryCitiesAr?: string[] } {
  const approvedProfile = approvedOsteopaths.find(
    (approved) => approved.email.toLowerCase() === profile.email.toLowerCase(),
  );
  return {
    ...profile,
    directoryCities: profile.directoryCities ?? approvedProfile?.directoryCities,
    directoryCitiesAr: profile.directoryCitiesAr ?? approvedProfile?.directoryCitiesAr,
  };
}

function toPublicDirectoryProfile(
  profile: StoredOsteopath | ApprovedOsteopath,
): PublicDirectoryOsteopath {
  const directoryProfile = withApprovedDirectoryLocations(profile);
  return {
    id: profile.id,
    name: profile.name,
    nameAr: profile.nameAr,
    specialty: profile.specialty,
    specialtyAr: profile.specialtyAr,
    city: profile.city,
    cityAr: profile.cityAr,
    country: profile.country,
    countryAr: profile.countryAr,
    location: profile.location,
    locationAr: profile.locationAr,
    phone: profile.phone,
    email: profile.email,
    bio: profile.bio,
    bioAr: profile.bioAr,
    profileImage: profile.profileImage ?? null,
    directoryCities: directoryProfile.directoryCities,
    directoryCitiesAr: directoryProfile.directoryCitiesAr,
  };
}

export async function getPublicOsteopaths(): Promise<{
  data: PublicDirectoryOsteopath[];
  unavailable: boolean;
}> {
  try {
    const databaseProfiles = await db.osteopath.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    const listedEmails = new Set(
      databaseProfiles.map((profile) => profile.email.toLowerCase()),
    );
    const profiles = [
      ...(databaseProfiles as StoredOsteopath[]),
      ...approvedOsteopaths.filter(
        (profile) => !listedEmails.has(profile.email.toLowerCase()),
      ),
    ];

    return {
      data: profiles.map(toPublicDirectoryProfile),
      unavailable: false,
    };
  } catch {
    return {
      data: approvedOsteopaths.map(toPublicDirectoryProfile),
      unavailable: true,
    };
  }
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
