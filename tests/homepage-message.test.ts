import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PUBLIC_PAGE_META } from '../src/lib/public-page-meta';

test('homepage hero states a concise public and professional value proposition', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');

  assert.match(source, /Find an osteopath\. Explore training in Egypt\./);
  assert.doesNotMatch(source, /EGSOM helps the public find listed practitioners/);
  assert.match(source, /Egyptian Society of Osteopathic Medicine/);
  assert.match(source, /ابحث عن ممارس أوستيوباثي\. واستكشف التدريب في مصر\./);
});

test('homepage retains both primary journeys and aligned metadata', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');

  assert.match(source, /href="\/find-osteopath"/);
  assert.match(source, /href="\/courses"/);
  assert.match(PUBLIC_PAGE_META['/'].en.title, /Osteopath[\s\S]*Training[\s\S]*Egypt/);
  assert.match(PUBLIC_PAGE_META['/'].en.description, /find listed osteopaths[\s\S]*education[\s\S]*directory listing/i);
});
