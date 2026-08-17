import { z } from 'zod';
import { externalUrlSchema } from '@/lib/url-security';

export const statisticSchema = z.object({
  value: z.string().trim().min(1).max(32),
  label: z.string().trim().min(2).max(80),
  labelAr: z.string().trim().min(2).max(100),
  sourceLabel: z.string().trim().min(2).max(120),
  sourceUrl: externalUrlSchema.optional().transform((value) => value || null),
  lastVerifiedAt: z.string().transform((value) => new Date(value)),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(1000).default(0),
}).superRefine((data, context) => {
  if (Number.isNaN(data.lastVerifiedAt.getTime())) {
    context.addIssue({ code: 'custom', path: ['lastVerifiedAt'], message: 'Use a valid verification date' });
  }
});
