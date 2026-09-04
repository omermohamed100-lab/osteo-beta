import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PUBLIC_PAGE_PATHS } from '../src/lib/i18n-routing';

test('homepage authority claims reflect the implemented directory process', async () => {
  const source = await readFile('src/app/page.tsx', 'utf8');
  assert.match(source, /Directory applications are reviewed individually and are never published automatically/);
  assert.match(source, /A listing is not certification/);
  assert.doesNotMatch(source, /Standards and regulation|safe, ethical, and effective osteopathic care|Leadership and representation/);
  assert.match(source, /href="\/standards"/);
});

test('standards page distinguishes listing review from credential evidence', async () => {
  const source = await readFile('src/app/standards/page.tsx', 'utf8');
  assert.match(source, /inactive draft with an unverified credential status/);
  assert.match(source, /do not mean[\s\S]*certified, licensed, accredited, or regulated/);
  assert.match(source, /credential type, number, issuing organization, verification date/);
  assert.match(source, /expiry date in the past is shown as expired/);
  assert.match(source, /updates are compared manually and do not overwrite a live profile automatically/);
  assert.match(source, /href="\/contact"/);
  assert.ok(PUBLIC_PAGE_PATHS.includes('/standards'));
});

test('about page does not imply unsupported regulatory authority', async () => {
  const source = await readFile('src/app/about/page.tsx', 'utf8');
  assert.match(source, /distinguish directory listing review from the status of a recorded credential/);
  assert.match(source, /Approved new applications become inactive drafts/);
  assert.doesNotMatch(source, /regulatory authority|accreditation body|licensed by EGSOM|better patient outcomes|Our members share knowledge|support ongoing research|Ready to join/i);
});
