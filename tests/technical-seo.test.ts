import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import robots from '../src/app/robots';
import { PUBLIC_PAGE_META } from '../src/lib/public-page-meta';

test('directory and course metadata use the approved Egypt-focused copy', () => {
  assert.deepEqual(PUBLIC_PAGE_META['/find-osteopath'].en, {
    title: 'Find an Osteopath in Egypt | EGSOM Directory',
    description: 'Find listed osteopaths in Egypt. Compare published training, practice locations and contact details, then contact a practitioner directly.',
  });
  assert.equal(PUBLIC_PAGE_META['/courses'].en.title, 'Osteopathy Courses & Training in Egypt | EGSOM');
  assert.match(PUBLIC_PAGE_META['/courses'].en.description, /osteopathy courses[\s\S]*Egypt/i);
  assert.match(PUBLIC_PAGE_META['/find-osteopath'].ar.title, /مصر/);
  assert.match(PUBLIC_PAGE_META['/courses'].ar.title, /مصر/);
});

test('admin login exposes noindex metadata without being blocked by robots', async () => {
  const [layout, footer] = await Promise.all([
    readFile('src/app/admin/login/layout.tsx', 'utf8'),
    readFile('src/components/layout/Footer.tsx', 'utf8'),
  ]);
  const manifest = robots();
  const rules = Array.isArray(manifest.rules) ? manifest.rules : [manifest.rules];

  assert.match(layout, /index: false/);
  assert.match(layout, /follow: false/);
  assert.ok(rules.some((rule) => Array.isArray(rule.allow) && rule.allow.includes('/admin/login')));
  assert.doesNotMatch(footer, /href="\/admin\/login"|Admin Login|دخول الإدارة/);
});

test('dynamic sitemap queries only active public records and retains safe fallbacks', async () => {
  const source = await readFile('src/app/sitemap.ts', 'utf8');

  assert.match(source, /db\.course\.findMany/);
  assert.match(source, /db\.activity\.findMany/);
  assert.match(source, /where: \{ isActive: true \}/g);
  assert.match(source, /getPublicOsteopaths\(\)/);
  assert.match(source, /getPublicData\(/);
});
