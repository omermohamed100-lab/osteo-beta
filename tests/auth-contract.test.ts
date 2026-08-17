import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const protectedRouteFiles = [
  'src/app/api/activities/route.ts',
  'src/app/api/activities/[id]/route.ts',
  'src/app/api/admin/account/route.ts',
  'src/app/api/auth/me/route.ts',
  'src/app/api/contact/route.ts',
  'src/app/api/contact/[id]/route.ts',
  'src/app/api/courses/route.ts',
  'src/app/api/courses/[id]/route.ts',
  'src/app/api/gallery/route.ts',
  'src/app/api/gallery/[id]/route.ts',
  'src/app/api/osteopaths/route.ts',
  'src/app/api/osteopaths/[id]/route.ts',
  'src/app/api/settings/route.ts',
] as const;

test('every protected API module uses the centralized admin authorization path', async () => {
  for (const relativePath of protectedRouteFiles) {
    const source = await readFile(path.join(process.cwd(), relativePath), 'utf8');
    assert.match(source, /requireAdmin\(/, `${relativePath} must call requireAdmin()`);
    assert.doesNotMatch(source, /getSession\(/, `${relativePath} must not call getSession()`);
  }
});

test('login rejects non-admin users before issuing a token', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/app/api/auth/login/route.ts'),
    'utf8',
  );
  const roleCheck = source.indexOf("user.role !== 'admin'");
  const tokenIssue = source.indexOf('signJWT({');

  assert.notEqual(roleCheck, -1);
  assert.notEqual(tokenIssue, -1);
  assert.ok(roleCheck < tokenIssue, 'role check must occur before token issuance');
  assert.match(source, /!user\.isActive/);
  assert.match(source, /sessionVersion:\s*user\.sessionVersion/);
});

test('password changes revoke old sessions and refresh the current session', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/app/api/admin/account/route.ts'),
    'utf8',
  );

  assert.match(source, /sessionVersion:\s*\{\s*increment:\s*1\s*\}/);
  assert.match(source, /signJWT\(\{/);
  assert.match(source, /setAdminSessionCookie\(response, token\)/);
});

test('login and contact mutations use the shared rate limiter', async () => {
  for (const relativePath of [
    'src/app/api/auth/login/route.ts',
    'src/app/api/contact/route.ts',
  ]) {
    const source = await readFile(path.join(process.cwd(), relativePath), 'utf8');
    assert.match(source, /consumeRateLimit\(/, `${relativePath} must use shared throttling`);
    assert.match(source, /rateLimitExceededResponse\(/, `${relativePath} must return 429`);
    assert.match(source, /rateLimitUnavailableResponse\(/, `${relativePath} must fail closed`);
  }
});

test('admin logout uses the server endpoint rather than client cookie mutation', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/layout/AdminSidebar.tsx'),
    'utf8',
  );

  assert.match(source, /fetch\('\/api\/auth\/logout'/);
  assert.doesNotMatch(source, /document\.cookie\s*=\s*['"]token=/);
});
