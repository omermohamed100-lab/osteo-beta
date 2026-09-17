import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { PrismaClient } from '@prisma/client';
import { adminPage, newestFirst, readAdminPagination } from '../src/lib/admin-pagination';
import { isSubmissionDuplicate } from '../src/lib/submission-dedupe';

// Never fall back to DATABASE_URL: these tests write only to a dedicated local database.
const target = process.env.RESILIENCE_TEST_DATABASE_URL;
if (!target) throw new Error('Set RESILIENCE_TEST_DATABASE_URL to the dedicated local egsom_resilience_test database.');
const url = new URL(target);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.pathname !== '/egsom_resilience_test') {
  throw new Error('Database integration tests require a local database named egsom_resilience_test.');
}
const db = new PrismaClient({ datasources: { db: { url: target } } });
const prefix = `resilience-${randomUUID()}`;
const email = `${prefix}@example.test`;
const expiresAt = new Date(Date.now() + 600_000);

test.after(async () => {
  await db.courseInterest.deleteMany({ where: { email } });
  await db.practitionerApplication.deleteMany({ where: { email } });
  await db.$disconnect();
});

test('simultaneous course-interest inserts create exactly one durable receipt', async () => {
  const keyHash = `${prefix}-interest`;
  const create = () => db.courseInterest.create({ data: {
    email, topic: 'Race test', consentNotifications: true,
    dedupeReservation: { create: { keyHash, expiresAt } },
  } });
  const results = await Promise.allSettled(Array.from({ length: 12 }, create));
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  for (const result of results) if (result.status === 'rejected') assert.equal(isSubmissionDuplicate(result.reason), true);
  assert.equal(await db.courseInterest.count({ where: { email, topic: 'Race test' } }), 1);

  // A new submission can be accepted after the reservation expires.
  await db.courseInterestDedupe.update({ where: { keyHash }, data: { expiresAt: new Date(0) } });
  await db.courseInterestDedupe.deleteMany({ where: { keyHash, expiresAt: { lte: new Date() } } });
  await create();
  assert.equal(await db.courseInterest.count({ where: { email, topic: 'Race test' } }), 2);
});

test('simultaneous practitioner inserts roll back losing receipts and photos', async () => {
  const results = await Promise.allSettled(Array.from({ length: 12 }, () => db.practitionerApplication.create({ data: {
    applicationType: 'new_listing', name: 'Integration fixture', email, phone: '0000000000',
    specialty: 'Fixture', city: 'Fixture', bio: 'Integration fixture only',
    credentialType: 'Fixture', credentialNumber: 'TEST', credentialIssuer: 'Fixture',
    consentAccuracy: true, consentPrivacy: true, photoData: Buffer.alloc(1024),
    dedupeReservation: { create: { keyHash: `${prefix}-application`, expiresAt } },
  } })));
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  for (const result of results) if (result.status === 'rejected') assert.equal(isSubmissionDuplicate(result.reason), true);
  assert.equal(await db.practitionerApplication.count({ where: { email } }), 1);
});

test('database pagination reaches beyond 250 records, even with tied dates and a deleted cursor', async () => {
  const createdAt = new Date('2020-01-01T00:00:00.000Z');
  await db.courseInterest.createMany({ data: Array.from({ length: 275 }, (_, index) => ({
    id: `${prefix}-${String(index).padStart(3, '0')}`, email, topic: 'Pagination test', consentNotifications: true, createdAt,
  })) });
  const seen = new Set<string>();
  let cursor: string | null = null;
  do {
    const { limit, where } = readAdminPagination(new URLSearchParams(cursor ? { cursor } : {}));
    const rows = await db.courseInterest.findMany({ where: { ...where, email, topic: 'Pagination test' }, orderBy: [...newestFirst], take: limit + 1 });
    const page = adminPage(rows, limit);
    for (const row of page.items) {
      assert.equal(seen.has(row.id), false, 'pagination must never repeat a record');
      seen.add(row.id);
    }
    cursor = page.nextCursor;
    if (seen.size === 25) await db.courseInterest.delete({ where: { id: page.items.at(-1)!.id } });
  } while (cursor);
  assert.equal(seen.size, 275);
});
