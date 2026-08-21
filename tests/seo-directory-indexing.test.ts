import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sitemap from '../src/app/sitemap';
import { approvedOsteopaths } from '../src/data/approved-osteopaths';

test('the directory renders practitioner data on the server before hydration', async () => {
  const [page, directory, publicData] = await Promise.all([
    readFile('src/app/find-osteopath/page.tsx', 'utf8'),
    readFile('src/components/directory/FindOsteopathDirectory.tsx', 'utf8'),
    readFile('src/lib/public-osteopath.ts', 'utf8'),
  ]);

  assert.doesNotMatch(page, /['"]use client['"]/);
  assert.match(page, /await getPublicOsteopaths\(\)/);
  assert.match(page, /initialOsteopaths=\{data\}/);
  assert.match(page, /initialDataUnavailable=\{unavailable\}/);
  assert.match(directory, /useState<Osteopath\[]>\(initialOsteopaths\)/);
  assert.match(directory, /useState\(false\)/);
  assert.match(directory, /dataUnavailable && osteopaths\.length === 0/);
  assert.match(publicData, /approvedOsteopaths\.map\(toPublicDirectoryProfile\)/);
});

test('the sitemap exposes every approved practitioner profile in both languages', () => {
  const entries = sitemap();

  for (const profile of approvedOsteopaths) {
    for (const language of ['en', 'ar'] as const) {
      const suffix = `/${language}/find-osteopath/${encodeURIComponent(profile.id)}`;
      const entry = entries.find((candidate) => candidate.url.endsWith(suffix));

      assert.ok(entry, `Missing sitemap entry for ${suffix}`);
      assert.equal(entry.lastModified, profile.profileReviewedAt);
      const languages = entry.alternates?.languages;
      assert.ok(languages);
      assert.equal(typeof languages?.en, 'string');
      assert.equal(typeof languages?.ar, 'string');
      assert.ok(languages.en!.endsWith(`/en/find-osteopath/${profile.id}`));
      assert.ok(languages.ar!.endsWith(`/ar/find-osteopath/${profile.id}`));
      assert.equal(languages['x-default'], languages.en);
    }
  }
});
