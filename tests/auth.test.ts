import assert from 'node:assert/strict';
import test from 'node:test';
import { SignJWT } from 'jose';
import { NextRequest } from 'next/server';
import {
  JWT_AUDIENCE,
  JWTConfigurationError,
  JWT_ISSUER,
  requireAdmin,
  signJWT,
  verifyJWT,
  type AdminUser,
} from '../src/lib/auth';
import { POST as logout } from '../src/app/api/auth/logout/route';

const TEST_SECRET = 'test-only-jwt-secret-with-at-least-32-bytes';
const originalSecret = process.env.JWT_SECRET;

test.afterEach(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

function requestWithToken(token: string) {
  return new NextRequest('http://localhost/api/test', {
    headers: { cookie: `token=${token}` },
  });
}

async function manuallySignedToken(overrides: {
  audience?: string;
  issuer?: string;
  expirationTime?: string;
  includeSessionVersion?: boolean;
} = {}) {
  return new SignJWT({
    id: 'admin-1',
    role: 'admin',
    ...(overrides.includeSessionVersion === false ? {} : { sessionVersion: 2 }),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(overrides.issuer ?? JWT_ISSUER)
    .setAudience(overrides.audience ?? JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(overrides.expirationTime ?? '1h')
    .sign(new TextEncoder().encode(TEST_SECRET));
}

test('signs and verifies a correctly scoped admin token', async () => {
  process.env.JWT_SECRET = TEST_SECRET;

  const token = await signJWT({ id: 'admin-1', role: 'admin', sessionVersion: 2 });
  const payload = await verifyJWT(token);

  assert.equal(payload?.id, 'admin-1');
  assert.equal(payload?.sessionVersion, 2);
  assert.equal(payload?.iss, JWT_ISSUER);
  assert.deepEqual(payload?.aud, JWT_AUDIENCE);
});

test('refuses to sign when JWT_SECRET is missing or weak', async () => {
  delete process.env.JWT_SECRET;
  await assert.rejects(() => signJWT({ id: 'admin-1' }), JWTConfigurationError);

  process.env.JWT_SECRET = 'too-short';
  await assert.rejects(() => signJWT({ id: 'admin-1' }), JWTConfigurationError);
});

test('rejects wrong issuer, wrong audience, and expired tokens', async () => {
  process.env.JWT_SECRET = TEST_SECRET;

  const wrongIssuer = await manuallySignedToken({ issuer: 'another-site' });
  const wrongAudience = await manuallySignedToken({ audience: 'another-audience' });
  const expired = await manuallySignedToken({ expirationTime: '0s' });

  assert.equal(await verifyJWT(wrongIssuer), null);
  assert.equal(await verifyJWT(wrongAudience), null);
  assert.equal(await verifyJWT(expired), null);
});

test('requireAdmin reloads the current user and accepts only the admin role', async () => {
  process.env.JWT_SECRET = TEST_SECRET;
  const token = await signJWT({ id: 'admin-1', role: 'admin', sessionVersion: 2 });
  const request = requestWithToken(token);
  const admin: AdminUser = {
    id: 'admin-1',
    email: 'admin@example.test',
    name: 'Admin',
    role: 'admin',
    isActive: true,
    sessionVersion: 2,
  };

  assert.deepEqual(await requireAdmin(request, async () => admin), admin);
  assert.equal(await requireAdmin(request, async () => null), null);
  assert.equal(
    await requireAdmin(request, async () => ({ ...admin, role: 'editor' })),
    null,
  );
  assert.equal(
    await requireAdmin(request, async () => ({ ...admin, isActive: false })),
    null,
  );
  assert.equal(
    await requireAdmin(request, async () => ({ ...admin, sessionVersion: 3 })),
    null,
  );
});

test('requireAdmin rejects legacy tokens without a session version', async () => {
  process.env.JWT_SECRET = TEST_SECRET;
  const token = await manuallySignedToken({ includeSessionVersion: false });
  let lookupCalled = false;

  const result = await requireAdmin(requestWithToken(token), async () => {
    lookupCalled = true;
    return null;
  });

  assert.equal(result, null);
  assert.equal(lookupCalled, false);
});

test('requireAdmin rejects missing and invalid cookies without a user lookup', async () => {
  process.env.JWT_SECRET = TEST_SECRET;
  let lookupCalled = false;
  const lookup = async () => {
    lookupCalled = true;
    return null;
  };

  const noCookie = new NextRequest('http://localhost/api/test');
  assert.equal(await requireAdmin(noCookie, lookup), null);
  assert.equal(await requireAdmin(requestWithToken('invalid-token'), lookup), null);
  assert.equal(lookupCalled, false);
});

test('server logout expires the HttpOnly authentication cookie', async () => {
  const response = await logout(new NextRequest('http://localhost/api/auth/logout', {
    method: 'POST',
    headers: { origin: 'http://localhost' },
  }));
  const setCookie = response.headers.get('set-cookie') ?? '';

  assert.equal(response.status, 200);
  assert.match(setCookie, /token=;/i);
  assert.match(setCookie, /Max-Age=0/i);
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=lax/i);
  assert.match(setCookie, /Path=\//i);
});
