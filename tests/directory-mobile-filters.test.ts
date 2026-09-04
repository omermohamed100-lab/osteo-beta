import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('location is first and secondary directory filters use one accessible mobile disclosure', async () => {
  const source = await readFile('src/components/directory/FindOsteopathDirectory.tsx', 'utf8');
  assert.ok(source.indexOf('id="city-filter"') < source.indexOf('id="specialty-filter"'));
  assert.match(source, /aria-expanded=\{secondaryOpen\}/);
  assert.match(source, /aria-controls="directory-secondary-filters"/);
  assert.match(source, /id="directory-secondary-filters"/);
  assert.match(source, /min-h-11/);
  assert.match(source, /sm:hidden/);
  assert.match(source, /sm:grid sm:grid-cols-3/);
  for (const id of ['city-filter', 'specialty-filter', 'country-filter', 'name-filter']) {
    assert.equal(source.match(new RegExp(`id="${id}"`, 'g'))?.length, 1);
  }
});

test('URL-backed secondary filters open mobile disclosure and expose a localized active count', async () => {
  const source = await readFile('src/components/directory/FindOsteopathDirectory.tsx', 'utf8');
  assert.match(source, /Boolean\(initialFilters\.specialty \|\| initialFilters\.country \|\| initialFilters\.name\)/);
  assert.match(source, /if \(filters\.specialty \|\| filters\.country \|\| filters\.name\) setSecondaryOpen\(true\)/);
  assert.match(source, /secondaryFilterCount/);
  assert.match(source, /More filters/);
  assert.match(source, /مزيد من عوامل البحث/);
  assert.match(source, /router\.replace\(nextHref, \{ scroll: false \}\)/);
  assert.match(source, /aria-live="polite"/);
});
