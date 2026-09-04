import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { directoryFiltersFromParams, directoryHref } from '../src/lib/directory-query';

test('directory query survives English to Arabic to English paths', () => {
  const filters = { city: 'Menoufia', specialty: 'General Practice', country: 'Egypt', name: 'Loay' };
  const english = directoryHref('/en/find-osteopath', '', filters);
  const query = english.split('?')[1];
  const arabic = directoryHref('/ar/find-osteopath', query, filters);
  const englishAgain = directoryHref('/en/find-osteopath', arabic.split('?')[1], filters);

  assert.deepEqual(directoryFiltersFromParams(new URL(englishAgain, 'https://example.test').searchParams), filters);
  assert.match(arabic, /^\/ar\/find-osteopath\?/);
});

test('directory query removes cleared filters and preserves unrelated parameters', () => {
  const href = directoryHref('/en/find-osteopath', 'ref=member&city=Cairo', {
    city: '', specialty: '', country: 'Egypt', name: '',
  });
  const url = new URL(href, 'https://example.test');

  assert.equal(url.searchParams.get('city'), null);
  assert.equal(url.searchParams.get('country'), 'Egypt');
  assert.equal(url.searchParams.get('ref'), 'member');
});

test('temporary bilingual form drafts use session storage and omit sensitive transient fields', async () => {
  const [contact, application, draftHelper] = await Promise.all([
    readFile('src/app/contact/page.tsx', 'utf8'),
    readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8'),
    readFile('src/lib/session-draft.ts', 'utf8'),
  ]);

  assert.match(draftHelper, /window\.sessionStorage/);
  assert.doesNotMatch(draftHelper, /localStorage/);
  assert.match(contact, /CONTACT_DRAFT_FIELDS = \['name', 'email', 'message'\]/);
  assert.match(application, /APPLICATION_DRAFT_FIELDS/);
  assert.match(contact, /writeSessionDraft\(CONTACT_DRAFT_KEY, next, CONTACT_DRAFT_FIELDS\)/);
  assert.match(application, /writeSessionDraft\(APPLICATION_DRAFT_KEY, next, APPLICATION_DRAFT_FIELDS\)/);
  assert.doesNotMatch(application.match(/const APPLICATION_DRAFT_FIELDS = \[[\s\S]*?\] as const/)?.[0] ?? '', /website|consentAccuracy|consentPrivacy/);
  assert.match(contact, /clearSessionDraft\(CONTACT_DRAFT_KEY\)[\s\S]*setStatus\('success'\)/);
  assert.match(application, /setStatus\('success'\)[\s\S]*clearSessionDraft\(APPLICATION_DRAFT_KEY\)/);
});
