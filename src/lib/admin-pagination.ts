import { z } from 'zod';

const cursorSchema = z.object({
  id: z.string().min(1).max(128),
  createdAt: z.string().datetime(),
}).strict();

export class InvalidPaginationError extends Error {}

export function readAdminPagination(params: URLSearchParams) {
  const rawLimit = params.get('limit') ?? '25';
  if (!/^\d{1,3}$/.test(rawLimit) || Number(rawLimit) < 1 || Number(rawLimit) > 100) {
    throw new InvalidPaginationError('Invalid page size');
  }
  const limit = Number(rawLimit);
  const rawCursor = params.get('cursor');
  if (!rawCursor) return { limit, where: {} };
  try {
    if (rawCursor.length > 512 || !/^[A-Za-z0-9_-]+$/.test(rawCursor)) throw new Error();
    const cursor = cursorSchema.parse(JSON.parse(Buffer.from(rawCursor, 'base64url').toString('utf8')));
    const createdAt = new Date(cursor.createdAt);
    return {
      limit,
      // Keyset pagination still works if the last item on a previous page was deleted.
      where: { OR: [{ createdAt: { lt: createdAt } }, { createdAt, id: { lt: cursor.id } }] },
    };
  } catch {
    throw new InvalidPaginationError('Invalid cursor');
  }
}

export const newestFirst = [{ createdAt: 'desc' }, { id: 'desc' }] as const;

export function adminPage<T extends { id: string; createdAt: Date }>(rows: T[], limit: number) {
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return {
    items,
    nextCursor: rows.length > limit && last
      ? Buffer.from(JSON.stringify({ id: last.id, createdAt: last.createdAt.toISOString() })).toString('base64url')
      : null,
  };
}
