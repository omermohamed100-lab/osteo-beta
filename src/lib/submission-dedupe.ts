import { Prisma } from '@prisma/client';
import { hashRateLimitKey } from '@/lib/rate-limit';

export const SUBMISSION_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

/** Input must be the validated, normalized submission, never raw request JSON. */
export function submissionDedupeKey(scope: string, data: unknown) {
  return hashRateLimitKey(`${scope}-dedupe`, JSON.stringify(data));
}

export function isSubmissionDuplicate(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && error.code === 'P2002'
    && Array.isArray(error.meta?.target)
    && error.meta.target.includes('keyHash');
}
