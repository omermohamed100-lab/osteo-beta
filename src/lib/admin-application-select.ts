import type { Prisma } from '@prisma/client';

// Authenticated admin list and review responses include submitted photos.
export const adminApplicationSelect = {
  id: true, applicationType: true, status: true, primaryLanguage: true,
  name: true, nameAr: true, email: true, phone: true,
  specialty: true, specialtyAr: true, city: true, cityAr: true,
  country: true, countryAr: true, location: true, locationAr: true,
  bio: true, bioAr: true,
  profileImage: true, photoData: true, photoMediaType: true, photoOriginalName: true,
  credentialType: true, credentialTypeAr: true, credentialNumber: true,
  credentialIssuer: true, credentialIssuerAr: true,
  credentialIssuedAt: true, credentialExpiresAt: true,
  existingProfileUrl: true, applicantNotes: true, reviewNotes: true,
  createdAt: true, reviewedAt: true,
  draftOsteopath: { select: { id: true, name: true, isActive: true } },
} satisfies Prisma.PractitionerApplicationSelect;
