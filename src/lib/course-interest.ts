import { z } from 'zod';

export const COURSE_INTEREST_BODY_MAX_BYTES = 2_048;

export const courseInterestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  topic: z.string().trim().max(120).default(''),
  consentNotifications: z.literal(true),
  website: z.string().max(200).default(''),
}).strict();
