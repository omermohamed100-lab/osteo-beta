import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import {
  RATE_LIMIT_SECRET_MIN_BYTES,
  RateLimitConfigurationError,
  cleanupExpiredRateLimits,
  consumeRateLimit,
  getClientAddress,
  hashRateLimitKey,
  normalizeRateLimitIdentity,
  rateLimitExceededResponse,
  type RateLimitStore,
} from '../src/lib/rate-limit';

const TEST_SECRET = 'test-only-rate-limit-secret-at-least-32-bytes';
const originalSecret = process.env.RATE_LIMIT_SECRET;

test.afterEach(() => {
  if (originalSecret === undefined) delete process.env.RATE_LIMIT_SECRET;
  else process.env.RATE_LIMIT_SECRET = originalSecret;
});

function memoryStore() {
  const counts = new Map<string, number>();
  const expiredAt: Date[] = [];
  const store: RateLimitStore = {
    async increment(bucket) {
      const count = (counts.get(bucket.id) ?? 0) + 1;
      counts.set(bucket.id, count);
      return count;
    },
    async deleteExpired(now) {
      expiredAt.push(now);
    },
  };
  return { counts, expiredAt, store };
}

test('uses a shared fixed window and blocks only after the configured limit', async () => {
  process.env.RATE_LIMIT_SECRET = TEST_SECRET;
  const memory = memoryStore();
  const policy = { scope: 'test', key: 'person@example.test', limit: 2, windowMs: 60_000 };
  const now = new Date('2026-08-14T12:00:30.000Z');

  const first = await consumeRateLimit(policy, memory.store, now);
  const second = await consumeRateLimit(policy, memory.store, now);
  const third = await consumeRateLimit(policy, memory.store, now);
  const nextWindow = await consumeRateLimit(
    policy,
    memory.store,
    new Date('2026-08-14T12:01:00.000Z'),
  );

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
  assert.equal(third.count, 3);
  assert.equal(third.retryAfterSeconds, 30);
  assert.equal(nextWindow.allowed, true);
  assert.equal(memory.counts.size, 2);
});

test('hashes rate-limit identities with a separate strong secret', () => {
  process.env.RATE_LIMIT_SECRET = TEST_SECRET;
  const rawIdentity = 'person@example.test';
  const first = hashRateLimitKey('contact-email', rawIdentity);
  const second = hashRateLimitKey('contact-email', rawIdentity);
  const otherScope = hashRateLimitKey('login-email', rawIdentity);

  assert.equal(first, second);
  assert.notEqual(first, otherScope);
  assert.doesNotMatch(first, /person|example/);
  assert.equal(first.length, 64);
});

test('fails closed when RATE_LIMIT_SECRET is missing or weak', async () => {
  const memory = memoryStore();
  delete process.env.RATE_LIMIT_SECRET;
  await assert.rejects(
    () => consumeRateLimit({ scope: 'test', key: 'key', limit: 1, windowMs: 1000 }, memory.store),
    RateLimitConfigurationError,
  );

  process.env.RATE_LIMIT_SECRET = 'x'.repeat(RATE_LIMIT_SECRET_MIN_BYTES - 1);
  await assert.rejects(
    () => consumeRateLimit({ scope: 'test', key: 'key', limit: 1, windowMs: 1000 }, memory.store),
    RateLimitConfigurationError,
  );
});

test('normalizes account identities and takes the first proxy-provided address', () => {
  assert.equal(normalizeRateLimitIdentity('  Admin@Example.COM  '), 'admin@example.com');
  const request = new NextRequest('https://example.test/api', {
    headers: {
      'x-forwarded-for': '203.0.113.10, 198.51.100.4',
      'x-real-ip': '192.0.2.9',
    },
  });
  assert.equal(getClientAddress(request), '192.0.2.9');
  assert.equal(getClientAddress(new NextRequest('https://example.test/api')), 'unknown');
});

test('returns a standards-compatible 429 response and supports expiry cleanup', async () => {
  const response = rateLimitExceededResponse(42.2);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '43');

  const memory = memoryStore();
  const now = new Date('2026-08-14T12:00:00.000Z');
  await cleanupExpiredRateLimits(memory.store, now);
  assert.deepEqual(memory.expiredAt, [now]);
});
