import { z } from 'zod';
import {
  hashRateLimitKey,
  normalizeRateLimitIdentity,
} from '@/lib/rate-limit';

export const CONTACT_BODY_MAX_BYTES = 32 * 1024;
export const CONTACT_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional().default(''),
}).strict();

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

export function createContactDedupeKey(data: ContactSubmissionInput) {
  const normalizedMessage = data.message.normalize('NFKC').replace(/\s+/g, ' ').trim();
  const identity = [
    normalizeRateLimitIdentity(data.email),
    data.name.normalize('NFKC').toLowerCase(),
    normalizedMessage,
  ].join('\0');
  return hashRateLimitKey('contact-dedupe', identity);
}
