import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('admin osteopaths include approved profiles that are not yet stored', async () => {
  const route = await readFile('src/app/api/osteopaths/route.ts', 'utf8');
  const page = await readFile('src/app/admin/osteopaths/page.tsx', 'utf8');

  assert.match(route, /if \(adminRequest\)/);
  assert.match(route, /recordSource: 'approved-fallback'/);
  assert.match(route, /recordSource: 'database'/);
  assert.match(page, /Approved source · sync pending/);
  assert.match(page, /additive production migration/);
});

test('approved osteopath sync migration is additive, idempotent, and unverified', async () => {
  const migration = await readFile('database/migrations/20260822020000_sync_approved_osteopaths/migration.sql', 'utf8');
  for (const email of [
    'drmariamgelwa32@gmail.com',
    'yahya.do20@gmail.com',
    'loaysoror@gmail.com',
    'meros.frd@gmail.com',
  ]) {
    assert.match(migration, new RegExp(email.replace('.', '\\.')));
  }
  assert.equal((migration.match(/WHERE NOT EXISTS/g) ?? []).length, 4);
  assert.equal((migration.match(/ON CONFLICT \("id"\) DO NOTHING/g) ?? []).length, 4);
  assert.equal((migration.match(/'unverified'/g) ?? []).length, 4);
  assert.doesNotMatch(migration, /\b(?:DELETE|DROP|TRUNCATE)\b/i);
});
