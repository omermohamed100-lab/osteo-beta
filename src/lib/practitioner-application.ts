import { z } from 'zod';
import { externalUrlSchema } from '@/lib/url-security';

export const PRACTITIONER_APPLICATION_BODY_MAX_BYTES = 3 * 1024 * 1024;
export const PRACTITIONER_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
export const PRACTITIONER_APPLICATION_DEDUPE_WINDOW_MS = 10 * 60 * 1000;
export const PRACTITIONER_APPLICATION_STATUSES = [
  'pending',
  'needs_information',
  'approved',
  'rejected',
] as const;

const compact = (maximum: number) => z.string().trim().max(maximum);
const required = (minimum: number, maximum: number) => compact(maximum).min(minimum);
const optionalDate = z.string().trim().max(10).optional().default('').transform((value, context) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    context.addIssue({ code: 'custom', message: 'Use a valid date' });
    return z.NEVER;
  }
  return date;
});

export const practitionerApplicationSchema = z.object({
  primaryLanguage: z.enum(['en', 'ar']).default('en'),
  applicationType: z.enum(['new_listing', 'profile_update']),
  name: compact(120),
  nameAr: compact(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: required(7, 40),
  specialty: compact(160), specialtyAr: compact(160), city: compact(100), cityAr: compact(100),
  country: compact(100).default('Egypt'), countryAr: compact(100), location: compact(240), locationAr: compact(240),
  bio: compact(3000), bioAr: compact(3000),
  profileImage: z.string().max(3_000_000).refine((value) => /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value), { message: 'A JPEG, PNG, or WebP photo is required' }),
  credentialType: compact(160), credentialTypeAr: compact(160),
  credentialNumber: required(2, 120),
  credentialIssuer: compact(200),
  credentialIssuerAr: compact(200),
  credentialIssuedAt: optionalDate,
  credentialExpiresAt: optionalDate,
  existingProfileUrl: externalUrlSchema.max(500).optional().or(z.literal('')).default(''),
  applicantNotes: compact(2000).default(''),
  consentAccuracy: z.literal(true),
  consentPrivacy: z.literal(true),
  website: compact(200).default(''),
}).strict().superRefine((data, context) => {
  const requiredPrimary = data.primaryLanguage === 'ar'
    ? ['nameAr', 'specialtyAr', 'cityAr', 'countryAr', 'locationAr', 'bioAr', 'credentialTypeAr', 'credentialIssuerAr'] as const
    : ['name', 'specialty', 'city', 'country', 'location', 'bio', 'credentialType', 'credentialIssuer'] as const;
  for (const field of requiredPrimary) {
    const minimum = field === 'bio' || field === 'bioAr' ? 20 : 2;
    if (data[field].length < minimum) context.addIssue({ code: 'custom', path: [field], message: 'Required in the primary submission language' });
  }
  if (data.applicationType === 'profile_update' && !data.existingProfileUrl) {
    context.addIssue({
      code: 'custom',
      path: ['existingProfileUrl'],
      message: 'The current directory profile URL is required for an update request',
    });
  }
  if (data.credentialIssuedAt && data.credentialExpiresAt && data.credentialExpiresAt < data.credentialIssuedAt) {
    context.addIssue({
      code: 'custom',
      path: ['credentialExpiresAt'],
      message: 'The expiry date must be after the issue date',
    });
  }
});

export const practitionerApplicationReviewSchema = z.object({
  status: z.enum(PRACTITIONER_APPLICATION_STATUSES),
  reviewNotes: compact(3000).default(''),
  name: compact(120).optional(), nameAr: compact(120).optional(),
  specialty: compact(160).optional(), specialtyAr: compact(160).optional(),
  city: compact(100).optional(), cityAr: compact(100).optional(),
  country: compact(100).optional(), countryAr: compact(100).optional(),
  location: compact(240).optional(), locationAr: compact(240).optional(),
  bio: compact(3000).optional(), bioAr: compact(3000).optional(),
  credentialType: compact(160).optional(), credentialTypeAr: compact(160).optional(),
  credentialIssuer: compact(200).optional(), credentialIssuerAr: compact(200).optional(),
}).strict();

export type PractitionerApplicationInput = z.input<typeof practitionerApplicationSchema>;
