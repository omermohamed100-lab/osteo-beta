import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { getPublicData } from '../src/lib/public-data';

test('public data helper distinguishes success, genuine empty data, and outages', async () => {
  const populated = await getPublicData(async () => ['item'], [] as string[]);
  const empty = await getPublicData(async () => [] as string[], ['fallback']);
  const unavailable = await getPublicData<string[]>(
    async () => { throw new Error('database unavailable'); },
    [],
  );

  assert.deepEqual(populated, { data: ['item'], unavailable: false });
  assert.deepEqual(empty, { data: [], unavailable: false });
  assert.deepEqual(unavailable, { data: [], unavailable: true });
});

test('collection pages check availability before their genuine empty state', async () => {
  for (const relativePath of [
    'src/app/courses/page.tsx',
    'src/app/activities/page.tsx',
    'src/app/gallery/page.tsx',
  ]) {
    const source = await readFile(path.join(process.cwd(), relativePath), 'utf8');
    const unavailableBranch = source.indexOf('dataUnavailable ?');
    const emptyBranch = source.search(/\.length\s*===\s*0\s*\?/);

    assert.match(source, /getPublicData\(/, `${relativePath} must retain availability`);
    assert.match(source, /PublicDataUnavailable/, `${relativePath} must use the shared notice`);
    assert.ok(unavailableBranch >= 0, `${relativePath} needs an outage branch`);
    assert.ok(emptyBranch > unavailableBranch, `${relativePath} must not label outages as empty`);
  }
});

test('footer distinguishes missing settings from an unavailable settings store', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/layout/Footer.tsx'),
    'utf8',
  );

  assert.match(source, /settingsUnavailable/);
  assert.match(source, /Contact details temporarily unavailable/);
  assert.match(source, /!settingsUnavailable\s*&&\s*!email\s*&&\s*!phone\s*&&\s*!address/);
  assert.doesNotMatch(source, /withPublicDataFallback/);
});

test('public practitioner API marks database fallback data as unavailable', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/app/api/osteopaths/route.ts'),
    'utf8',
  );
  const fallback = source.indexOf('NextResponse.json(approvedOsteopaths');
  const statusHeader = source.indexOf("'x-egsom-data-status': 'unavailable'", fallback);

  assert.ok(fallback >= 0);
  assert.ok(statusHeader > fallback);
});

test('shared availability notice is localized, retryable, and status-announced', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/public/PublicDataUnavailable.tsx'),
    'utf8',
  );

  assert.match(source, /role="status"/);
  assert.match(source, /window\.location\.reload\(\)/);
  assert.match(source, /Try again/);
  assert.match(source, /حاول مرة أخرى/);
});
