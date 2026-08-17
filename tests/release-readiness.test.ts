import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Vercel applies additive migrations before building the production release', async () => {
  const [packageSource, vercelSource, migrationRunner] = await Promise.all([
    readFile('package.json', 'utf8'),
    readFile('vercel.json', 'utf8'),
    readFile('scripts/deploy-migrations.mjs', 'utf8'),
  ]);
  const packageJson = JSON.parse(packageSource);
  const vercelJson = JSON.parse(vercelSource);
  assert.equal(packageJson.scripts['build:vercel'], 'node scripts/deploy-migrations.mjs && npm run build');
  assert.equal(vercelJson.buildCommand, 'npm run build:vercel');
  assert.match(migrationRunner, /output\.includes\('P3005'\)/);
  assert.match(migrationRunner, /migrate', 'resolve', '--applied', baseline/);
  assert.match(migrationRunner, /deployment = runPrisma\(\['migrate', 'deploy'\]\)/);
});

test('migration history includes an idempotent baseline for the pre-migration production schema', async () => {
  const baseline = await readFile(
    'database/migrations/20260515000000_initial_schema/migration.sql',
    'utf8',
  );
  for (const table of ['User', 'Course', 'ContactSubmission', 'SiteSettings', 'Osteopath', 'GalleryItem', 'Activity']) {
    assert.match(baseline, new RegExp(`CREATE TABLE IF NOT EXISTS "${table}"`));
  }
});

test('known demonstration contact values are removed by an exact-match migration', async () => {
  const migration = await readFile(
    'database/migrations/20260818030000_clear_placeholder_contact_details/migration.sql',
    'utf8',
  );
  assert.match(migration, /no-reply@example\.com/);
  assert.match(migration, /\+201234567890/);
  assert.doesNotMatch(migration, /DELETE\s+FROM/i);
});

test('privacy is localized, linked from contact and footer, and included in public routing', async () => {
  const [page, contact, footer, routing] = await Promise.all([
    readFile('src/app/privacy/page.tsx', 'utf8'),
    readFile('src/app/contact/page.tsx', 'utf8'),
    readFile('src/components/layout/Footer.tsx', 'utf8'),
    readFile('src/lib/i18n-routing.ts', 'utf8'),
  ]);
  assert.match(page, /Information we handle/);
  assert.match(page, /المعلومات التي نتعامل معها/);
  assert.match(contact, /href="\/privacy"/);
  assert.match(footer, /href: '\/privacy'/);
  assert.match(routing, /'\/privacy'/);
});
