import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const RATE_LIMIT_SECRET_MIN_BYTES = 32;

export type RateLimitPolicy = {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
};

export type RateLimitStore = {
  increment: (bucket: {
    id: string;
    scope: string;
    keyHash: string;
    windowStart: Date;
    expiresAt: Date;
  }) => Promise<number>;
  deleteExpired: (now: Date) => Promise<void>;
};

export class RateLimitConfigurationError extends Error {
  constructor() {
    super(`RATE_LIMIT_SECRET must be configured with at least ${RATE_LIMIT_SECRET_MIN_BYTES} bytes.`);
    this.name = 'RateLimitConfigurationError';
  }
}

function getRateLimitSecret() {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < RATE_LIMIT_SECRET_MIN_BYTES) {
    throw new RateLimitConfigurationError();
  }
  return secret;
}

export function hashRateLimitKey(scope: string, key: string) {
  return createHmac('sha256', getRateLimitSecret())
    .update(`${scope}\0${key}`)
    .digest('hex');
}

function firstAddress(value: string | null) {
  const address = value?.split(',', 1)[0].trim();
  return address ? address.slice(0, 128) : null;
}

export function getClientAddress(request: NextRequest) {
  return firstAddress(request.headers.get('x-real-ip'))
    ?? firstAddress(request.headers.get('x-forwarded-for'))
    ?? 'unknown';
}

export function normalizeRateLimitIdentity(value: string) {
  return value.normalize('NFKC').trim().toLowerCase().slice(0, 320);
}

const prismaRateLimitStore: RateLimitStore = {
  async increment(bucket) {
    const record = await db.rateLimitBucket.upsert({
      where: { id: bucket.id },
      create: { ...bucket, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true },
    });
    return record.count;
  },
  async deleteExpired(now) {
    await db.rateLimitBucket.deleteMany({ where: { expiresAt: { lte: now } } });
  },
};

export async function consumeRateLimit(
  policy: RateLimitPolicy,
  store: RateLimitStore = prismaRateLimitStore,
  now = new Date(),
): Promise<RateLimitResult> {
  if (!policy.scope || policy.limit < 1 || policy.windowMs < 1000) {
    throw new RangeError('Invalid rate-limit policy.');
  }

  const nowMs = now.getTime();
  const windowStartMs = Math.floor(nowMs / policy.windowMs) * policy.windowMs;
  const expiresAtMs = windowStartMs + policy.windowMs;
  const keyHash = hashRateLimitKey(policy.scope, policy.key);
  const count = await store.increment({
    id: `${policy.scope}:${windowStartMs}:${keyHash}`,
    scope: policy.scope,
    keyHash,
    windowStart: new Date(windowStartMs),
    expiresAt: new Date(expiresAtMs),
  });

  return {
    allowed: count <= policy.limit,
    count,
    limit: policy.limit,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAtMs - nowMs) / 1000)),
  };
}

export async function cleanupExpiredRateLimits(
  store: RateLimitStore = prismaRateLimitStore,
  now = new Date(),
) {
  await store.deleteExpired(now);
}

export function rateLimitExceededResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.max(1, Math.ceil(retryAfterSeconds))) },
    },
  );
}

export function rateLimitUnavailableResponse() {
  return NextResponse.json(
    { error: 'This service is temporarily unavailable. Please try again later.' },
    { status: 503 },
  );
}
