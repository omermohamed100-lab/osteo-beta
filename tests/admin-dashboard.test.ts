import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('dashboard totals come from one protected, non-cached admin endpoint', async () => {
  const route = await readFile('src/app/api/admin/dashboard/route.ts', 'utf8');
  const dashboard = await readFile('src/app/admin/dashboard/page.tsx', 'utf8');

  assert.match(route, /await requireAdmin\(request\)/);
  assert.match(route, /db\.contactSubmission\.count\(\)/);
  assert.match(route, /approvedOsteopaths\.filter\(/);
  assert.match(route, /'Cache-Control': 'no-store, max-age=0'/);
  assert.match(dashboard, /fetch\('\/api\/admin\/dashboard', \{ cache: 'no-store' \}\)/);
  assert.doesNotMatch(dashboard, /Promise\.all\(fetches\)/);
});

test('dashboard exposes messages and does not present request failures as zero totals', async () => {
  const dashboard = await readFile('src/app/admin/dashboard/page.tsx', 'utf8');

  assert.match(dashboard, /key: 'messages'/);
  assert.match(dashboard, /href: '\/admin\/messages'/);
  assert.match(dashboard, /Dashboard totals could not be loaded/);
  assert.match(dashboard, /stats\?\.\[card\.key\] \?\? '—'/);
  assert.match(dashboard, /role="alert"/);
});
