import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PUBLIC_PAGE_META } from '../src/lib/public-page-meta';
import { siteSettingsDefaults } from '../src/lib/site-settings';

test('homepage hero states a concise public and professional value proposition', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');

  assert.equal(siteSettingsDefaults.heroHeadline, 'Find an osteopath. Explore training in Egypt.');
  assert.equal(siteSettingsDefaults.heroDescription, 'EGSOM advances awareness, education, and professional osteopathic practice in Egypt, supporting practitioners across Egypt and the Middle East through training, knowledge exchange, and international partnerships.');
  assert.doesNotMatch(source, /EGSOM helps the public find listed practitioners/);
  assert.match(source, /hero\.heroEyebrow/);
  assert.match(source, /hero\.heroHeadlineAr/);
});

test('homepage retains both primary journeys and aligned metadata', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');

  assert.match(source, /href=\{hero\.heroPrimaryHref\}/);
  assert.match(source, /href=\{hero\.heroSecondaryHref\}/);
  assert.equal(siteSettingsDefaults.heroPrimaryHref, '/about');
  assert.equal(siteSettingsDefaults.heroSecondaryHref, '/find-osteopath');
  assert.match(PUBLIC_PAGE_META['/'].en.title, /Osteopath[\s\S]*Training[\s\S]*Egypt/);
  assert.match(PUBLIC_PAGE_META['/'].en.description, /find listed osteopaths[\s\S]*education[\s\S]*directory listing/i);
});
