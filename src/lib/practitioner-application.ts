import { z } from 'zod';
import { externalUrlSchema } from '@/lib/url-security';

export const PRACTITIONER_APPLICATION_BODY_MAX_BYTES = 48 * 1024;
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
  applicationType: z.enum(['new_listing', 'profile_update']),
  name: required(2, 120),
  nameAr: required(2, 120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: required(7, 40),
  specialty: required(2, 160),
  specialtyAr: required(2, 160),
  city: required(2, 100),
  cityAr: required(2, 100),
  country: required(2, 100).default('Egypt'),
  countryAr: required(2, 100),
  location: required(2, 240),
  locationAr: required(2, 240),
  bio: required(20, 3000),
  bioAr: required(20, 3000),
  profileImage: externalUrlSchema.max(500).refine((value) => value.length > 0, {
    message: 'A public HTTPS professional photo URL is required',
  }),
  credentialType: required(2, 160),
  credentialTypeAr: required(2, 160),
  credentialNumber: required(2, 120),
  credentialIssuer: required(2, 200),
  credentialIssuerAr: required(2, 200),
  credentialIssuedAt: optionalDate,
  credentialExpiresAt: optionalDate,
  existingProfileUrl: externalUrlSchema.max(500).optional().or(z.literal('')).default(''),
  applicantNotes: compact(2000).default(''),
  consentAccuracy: z.literal(true),
  consentPrivacy: z.literal(true),
  website: compact(200).default(''),
}).strict().superRefine((data, context) => {
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
}).strict();

export type PractitionerApplicationInput = z.input<typeof practitionerApplicationSchema>;
