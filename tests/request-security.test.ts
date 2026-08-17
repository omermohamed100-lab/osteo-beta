import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { NextRequest } from 'next/server';
import {
  enforceMutationRequest,
  InvalidJsonBodyError,
  readBoundedJsonBody,
  RequestBodyTooLargeError,
} from '../src/lib/request-security';

const originalTrustedOrigins = process.env.TRUSTED_ORIGINS;

test.afterEach(() => {
  if (originalTrustedOrigins === undefined) delete process.env.TRUSTED_ORIGINS;
  else process.env.TRUSTED_ORIGINS = originalTrustedOrigins;
});

function mutationRequest(options: {
  origin?: string;
  contentType?: string;
  url?: string;
} = {}) {
  const headers = new Headers();
  if (options.origin) headers.set('origin', options.origin);
  if (options.contentType) headers.set('content-type', options.contentType);

  return new NextRequest(options.url ?? 'https://egsom.example/api/test', {
    method: 'POST',
    headers,
  });
}

test('accepts same-origin JSON mutations', () => {
  const result = enforceMutationRequest(mutationRequest({
    origin: 'https://egsom.example',
    contentType: 'application/json; charset=utf-8',
  }));

  assert.equal(result, null);
});

test('rejects missing and cross-origin mutation requests', () => {
  const missing = enforceMutationRequest(mutationRequest({ contentType: 'application/json' }));
  const crossOrigin = enforceMutationRequest(mutationRequest({
    origin: 'https://attacker.example',
    contentType: 'application/json',
  }));

  assert.equal(missing?.status, 403);
  assert.equal(crossOrigin?.status, 403);
});

test('accepts an explicitly configured trusted origin', () => {
  process.env.TRUSTED_ORIGINS = 'https://admin.egsom.example';
  const result = enforceMutationRequest(mutationRequest({
    origin: 'https://admin.egsom.example',
    contentType: 'application/json',
  }));

  assert.equal(result, null);
});

test('accepts the normalized request host when a framework uses a canonical internal URL', () => {
  const request = mutationRequest({
    origin: 'http://127.0.0.1:3000',
    contentType: 'application/json',
    url: 'http://localhost:3000/api/test',
  });
  request.headers.set('host', '127.0.0.1:3000');

  assert.equal(enforceMutationRequest(request), null);
});

test('requires JSON for body-bearing mutations', () => {
  const missing = enforceMutationRequest(mutationRequest({ origin: 'https://egsom.example' }));
  const wrong = enforceMutationRequest(mutationRequest({
    origin: 'https://egsom.example',
    contentType: 'text/plain',
  }));

  assert.equal(missing?.status, 415);
  assert.equal(wrong?.status, 415);
});

test('allows bodyless mutations to opt out of JSON while retaining origin checks', () => {
  const accepted = enforceMutationRequest(
    mutationRequest({ origin: 'https://egsom.example' }),
    { requireJson: false },
  );
  const rejected = enforceMutationRequest(
    mutationRequest({ origin: 'https://attacker.example' }),
    { requireJson: false },
  );

  assert.equal(accepted, null);
  assert.equal(rejected?.status, 403);
});

test('reads JSON bodies without exceeding the configured byte limit', async () => {
  const request = new NextRequest('https://egsom.example/api/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'received' }),
  });

  assert.deepEqual(await readBoundedJsonBody(request, 100), { message: 'received' });
});

test('rejects declared and streamed bodies that exceed the configured limit', async () => {
  const declared = new NextRequest('https://egsom.example/api/test', {
    method: 'POST',
    headers: { 'content-length': '101' },
    body: '{}',
  });
  const streamed = new NextRequest('https://egsom.example/api/test', {
    method: 'POST',
    body: JSON.stringify({ message: 'x'.repeat(100) }),
  });

  await assert.rejects(() => readBoundedJsonBody(declared, 100), RequestBodyTooLargeError);
  await assert.rejects(() => readBoundedJsonBody(streamed, 50), RequestBodyTooLargeError);
});

test('rejects malformed or missing JSON bodies', async () => {
  const malformed = new NextRequest('https://egsom.example/api/test', {
    method: 'POST',
    body: '{not-json}',
  });
  const empty = new NextRequest('https://egsom.example/api/test', { method: 'POST' });

  await assert.rejects(() => readBoundedJsonBody(malformed, 100), InvalidJsonBodyError);
  await assert.rejects(() => readBoundedJsonBody(empty, 100), InvalidJsonBodyError);
});

test('every mutation route enforces the centralized request policy', async () => {
  const routeFiles = [
    'src/app/api/activities/route.ts',
    'src/app/api/activities/[id]/route.ts',
    'src/app/api/admin/account/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/logout/route.ts',
    'src/app/api/contact/route.ts',
    'src/app/api/contact/[id]/route.ts',
    'src/app/api/courses/route.ts',
    'src/app/api/courses/[id]/route.ts',
    'src/app/api/gallery/route.ts',
    'src/app/api/gallery/[id]/route.ts',
    'src/app/api/osteopaths/route.ts',
    'src/app/api/osteopaths/[id]/route.ts',
    'src/app/api/settings/route.ts',
  ];

  for (const relativePath of routeFiles) {
    const source = await readFile(path.join(process.cwd(), relativePath), 'utf8');
    const mutations = source.match(/export async function (?:POST|PUT|PATCH|DELETE)\b/g) ?? [];
    const enforcementCalls = source.match(/enforceMutationRequest\(/g) ?? [];
    assert.equal(
      enforcementCalls.length,
      mutations.length,
      `${relativePath} must enforce every mutation handler`,
    );
  }
});
