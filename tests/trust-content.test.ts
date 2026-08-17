import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { isPublicPagePath, localizePublicHref } from '../src/lib/i18n-routing';
import { statisticSchema } from '../src/lib/statistics';
import { getPublicCredentialStatus } from '../src/lib/practitioner-credentials';

test('nested visitor journeys are recognized and localized', () => {
  assert.equal(isPublicPagePath('/practitioners'), true);
  assert.equal(isPublicPagePath('/courses/course-1'), true);
  assert.equal(isPublicPagePath('/activities/event-1'), true);
  assert.equal(isPublicPagePath('/find-osteopath/profile-1'), true);
  assert.equal(isPublicPagePath('/courses/course-1/more'), false);
  assert.equal(localizePublicHref('/courses/course-1', 'ar'), '/ar/courses/course-1');
});

test('public statistics require bilingual labels, a source, and a valid verification date', () => {
  const valid = statisticSchema.safeParse({
    value: '24',
    label: 'Published courses',
    labelAr: 'الدورات المنشورة',
    sourceLabel: 'Owner-approved annual report',
    sourceUrl: 'https://example.org/report',
    lastVerifiedAt: '2026-08-18',
    isPublished: true,
    sortOrder: 1,
  });
  assert.equal(valid.success, true);

  assert.equal(statisticSchema.safeParse({
    value: '24', label: 'Published courses', labelAr: '', sourceLabel: '',
    sourceUrl: 'http://localhost/report', lastVerifiedAt: 'not-a-date',
  }).success, false);
});

test('trust schema is additive and defaults credentials to unverified', async () => {
  const schema = await readFile('database/schema.prisma', 'utf8');
  assert.match(schema, /credentialStatus\s+String\s+@default\("unverified"\)/);
  assert.match(schema, /credentialVerifiedAt\s+DateTime\?/);
  assert.match(schema, /profileReviewedAt\s+DateTime\?/);
  assert.match(schema, /model PublicStatistic/);
  assert.match(schema, /sourceLabel\s+String/);
  assert.match(schema, /lastVerifiedAt\s+DateTime/);
});

test('public credential labels require complete evidence and respect expiry', () => {
  const complete = {
    credentialType: 'Registration',
    credentialNumber: 'REG-123',
    credentialIssuer: 'Issuing body',
    credentialStatus: 'verified',
    credentialVerifiedAt: '2026-01-01',
  };
  assert.equal(getPublicCredentialStatus(complete, new Date('2026-08-18')), 'verified');
  assert.equal(getPublicCredentialStatus({ ...complete, credentialNumber: '' }), 'unverified');
  assert.equal(getPublicCredentialStatus({ ...complete, credentialExpiresAt: '2026-02-01' }, new Date('2026-08-18')), 'expired');
  assert.equal(getPublicCredentialStatus({ ...complete, credentialStatus: 'unverified' }), 'unverified');
});

test('unsupported public credibility claims and hard-coded statistics are absent', async () => {
  const publicFiles = await Promise.all([
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/courses/page.tsx',
    'src/app/find-osteopath/page.tsx',
    'src/components/home/AnimatedBoxes.tsx',
    'src/components/home/HomeShowcase.tsx',
  ].map((path) => readFile(path, 'utf8')));
  const publicSource = publicFiles.join('\n').toLowerCase();
  for (const claim of ['500+', 'registered members', 'certified practitioners', 'accredited education', 'rigorous standards', 'world-class care']) {
    assert.equal(publicSource.includes(claim), false, `Unsupported claim remains: ${claim}`);
  }
});
