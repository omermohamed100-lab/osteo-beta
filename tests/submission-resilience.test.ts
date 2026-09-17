import assert from 'node:assert/strict';
import test from 'node:test';
import { Prisma } from '@prisma/client';
import { adminPage, InvalidPaginationError, readAdminPagination } from '../src/lib/admin-pagination';
import { adminApplicationSelect } from '../src/lib/admin-application-select';
import { isSubmissionDuplicate, submissionDedupeKey } from '../src/lib/submission-dedupe';
import { RequestTimeoutError, fetchJsonWithTimeout, withRequestTimeout } from '../src/lib/fetch-with-timeout';
import { courseInterestSchema } from '../src/lib/course-interest';

test('pagination validates untrusted cursors and enforces bounded page sizes', () => {
  assert.equal(readAdminPagination(new URLSearchParams()).limit, 25);
  for (const limit of ['0', '-1', '101', '250', '1.5', 'abc', '1e2', '']) {
    assert.throws(() => readAdminPagination(new URLSearchParams({ limit })), InvalidPaginationError);
  }
  for (const cursor of ['!', 'a'.repeat(513), Buffer.from('{"id":"x","createdAt":"bad"}').toString('base64url')]) {
    assert.throws(() => readAdminPagination(new URLSearchParams({ cursor })), InvalidPaginationError);
  }
});

test('keyset pages retain timestamp ties and do not depend on the cursor row existing', () => {
  const createdAt = new Date('2026-09-16T12:00:00.000Z');
  const rows = ['d', 'c', 'b', 'a'].map((id) => ({ id, createdAt }));
  const first = adminPage(rows, 2);
  assert.deepEqual(first.items.map((item) => item.id), ['d', 'c']);
  const { where } = readAdminPagination(new URLSearchParams({ cursor: first.nextCursor! }));
  assert.deepEqual(where, { OR: [{ createdAt: { lt: createdAt } }, { createdAt, id: { lt: 'c' } }] });
  assert.equal(adminPage(rows.slice(2), 2).nextCursor, null);
  assert.deepEqual(adminPage([], 25), { items: [], nextCursor: null });
});

test('admin application responses include uploaded photos and their metadata', () => {
  assert.equal(adminApplicationSelect.photoData, true);
  assert.equal(adminApplicationSelect.photoMediaType, true);
  assert.equal(adminApplicationSelect.photoOriginalName, true);
  assert.equal(adminApplicationSelect.profileImage, true);
  assert.equal(adminApplicationSelect.credentialNumber, true);
});

test('duplicate identity is normalized, scoped and does not expose email', () => {
  const original = process.env.RATE_LIMIT_SECRET;
  process.env.RATE_LIMIT_SECRET = 'test-only-rate-limit-secret-at-least-32-bytes';
  try {
    const first = courseInterestSchema.parse({ email: ' PERSON@example.test ', topic: ' Foundations ', consentNotifications: true });
    const second = courseInterestSchema.parse({ email: 'person@example.test', topic: 'Foundations', consentNotifications: true });
    const key = submissionDedupeKey('course-interest', first);
    assert.equal(key, submissionDedupeKey('course-interest', second));
    assert.notEqual(key, submissionDedupeKey('application', first));
    assert.notEqual(key, submissionDedupeKey('course-interest', { ...first, topic: 'Advanced' }));
    assert.match(key, /^[a-f0-9]{64}$/);
  } finally {
    if (original === undefined) delete process.env.RATE_LIMIT_SECRET;
    else process.env.RATE_LIMIT_SECRET = original;
  }
});

test('only reservation uniqueness violations count as successful duplicate receipts', () => {
  const error = (code: string, target: string[]) => new Prisma.PrismaClientKnownRequestError('test', { code, clientVersion: '5', meta: { target } });
  assert.equal(isSubmissionDuplicate(error('P2002', ['keyHash'])), true);
  assert.equal(isSubmissionDuplicate(error('P2002', ['id'])), false);
  assert.equal(isSubmissionDuplicate(error('P2021', ['keyHash'])), false);
  assert.equal(isSubmissionDuplicate(new Error('database unavailable')), false);
});

test('timeouts abort a stalled request without retrying it', async () => {
  let attempts = 0;
  await assert.rejects(withRequestTimeout((signal) => {
    attempts++;
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  }, 15), RequestTimeoutError);
  assert.equal(attempts, 1);
});

test('request deadline includes a stalled JSON response body', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"unfinished":'));
      init?.signal?.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')));
    },
  }));
  try {
    await assert.rejects(fetchJsonWithTimeout('https://example.test', {}, 15), RequestTimeoutError);
  } finally { globalThis.fetch = originalFetch; }
});

test('caller cancellation propagates and successful requests release their deadline', async () => {
  const parent = new AbortController();
  const pending = withRequestTimeout((signal) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason));
  }), 500, parent.signal);
  parent.abort(new Error('left page'));
  await assert.rejects(pending, /left page/);
  let wasAborted = false;
  assert.equal(await withRequestTimeout(async (signal) => {
    signal.addEventListener('abort', () => { wasAborted = true; });
    return 42;
  }, 15), 42);
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(wasAborted, false);
});
