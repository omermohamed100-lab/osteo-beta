import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('conversion analytics uses a stable privacy-safe event contract', async () => {
  const analytics = await readFile('src/lib/conversion-analytics.ts', 'utf8');
  for (const event of [
    'practitioner_profile_view', 'practitioner_phone_click', 'practitioner_email_click',
    'education_interest_click', 'education_inquiry_received',
    'practitioner_application_start', 'practitioner_application_complete',
  ]) {
    assert.match(analytics, new RegExp(event));
  }
  assert.doesNotMatch(analytics, /\b(?:name|email|phone|message|title|credential)\s*:/);
  assert.match(analytics, /try \{[\s\S]*track\(event, properties\)[\s\S]*\} catch/);
});

test('profile views and application starts are Strict Mode safe', async () => {
  const [analytics, profile, application] = await Promise.all([
    readFile('src/lib/conversion-analytics.ts', 'utf8'),
    readFile('src/components/analytics/PractitionerProfileAnalytics.tsx', 'utf8'),
    readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8'),
  ]);
  assert.match(analytics, /window\.sessionStorage\.getItem\(storageKey\)/);
  assert.match(profile, /trackOncePerSession/);
  assert.match(application, /trackOncePerSession/);
});

test('education and practitioner conversion steps fire only at confirmed interactions', async () => {
  const [contact, application, inquiryLink, profile] = await Promise.all([
    readFile('src/app/contact/page.tsx', 'utf8'),
    readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8'),
    readFile('src/components/analytics/TrackedInquiryLink.tsx', 'utf8'),
    readFile('src/components/analytics/PractitionerProfileAnalytics.tsx', 'utf8'),
  ]);
  assert.match(contact, /if \(res\.ok\)[\s\S]*education_inquiry_received/);
  assert.match(application, /setStatus\('success'\)[\s\S]*practitioner_application_complete/);
  assert.match(inquiryLink, /education_interest_click/);
  assert.match(profile, /practitioner_phone_click/);
  assert.match(profile, /practitioner_email_click/);
});
