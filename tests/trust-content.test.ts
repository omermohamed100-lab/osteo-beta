import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { isPublicPagePath, localizePublicHref } from '../src/lib/i18n-routing';
import { statisticSchema } from '../src/lib/statistics';
import { getPublicCredentialStatus } from '../src/lib/practitioner-credentials';
import { approvedOsteopaths } from '../src/data/approved-osteopaths';
import { getArabicContent } from '../src/lib/arabic-content';

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
  for (const field of ['nameAr', 'cityAr', 'countryAr', 'credentialTypeAr', 'credentialIssuerAr']) {
    assert.match(schema, new RegExp(`${field}\\s+String\\s+@default\\(""\\)`));
  }
});

test('approved practitioner profiles have complete Arabic public content', () => {
  for (const profile of approvedOsteopaths) {
    for (const field of ['nameAr', 'specialtyAr', 'cityAr', 'countryAr', 'locationAr', 'bioAr'] as const) {
      assert.ok(profile[field]?.trim(), `${profile.id} is missing ${field}`);
    }
    assert.equal(profile.credentialStatus ?? 'unverified', 'unverified');
  }
  assert.equal(getArabicContent(''), 'متاح باللغة الإنجليزية');
});

test('Arabic practitioner migration is additive and backfills approved records', async () => {
  const migration = await readFile(
    'database/migrations/20260821010000_complete_practitioner_arabic_fields/migration.sql',
    'utf8',
  );
  for (const field of ['nameAr', 'cityAr', 'countryAr', 'credentialTypeAr', 'credentialIssuerAr']) {
    assert.match(migration, new RegExp(`ADD COLUMN "${field}"`));
  }
  for (const email of ['drmariamgelwa32@gmail.com', 'yahya.do20@gmail.com', 'loaysoror@gmail.com', 'meros.frd@gmail.com']) {
    assert.match(migration, new RegExp(email.replace('.', '\\.')));
  }
  assert.match(migration, /القاهرة، مصر/);
  assert.match(migration, /CASE WHEN "specialtyAr" = ''/);
  assert.doesNotMatch(migration, /\b(?:DROP|DELETE|RENAME)\b/i);
});

test('Arabic public records use an explicit notice instead of silent English fallback', async () => {
  const publicSource = (await Promise.all([
    'src/app/courses/page.tsx',
    'src/app/courses/[id]/page.tsx',
    'src/app/activities/page.tsx',
    'src/app/activities/[id]/page.tsx',
    'src/app/gallery/page.tsx',
    'src/app/find-osteopath/page.tsx',
    'src/app/find-osteopath/[id]/page.tsx',
  ].map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(publicSource, /getArabicContent/);
  assert.doesNotMatch(publicSource, /(course|activity|profile|item|o)\.(title|description|instructor|duration|location|caption|specialty|bio|name|city|country)Ar\s*\|\|\s*\1\.\2/);

  const adminSource = (await Promise.all([
    'src/app/admin/osteopaths/page.tsx',
    'src/app/admin/courses/page.tsx',
    'src/app/admin/activities/page.tsx',
    'src/app/admin/gallery/page.tsx',
    'src/app/admin/contact-info/page.tsx',
  ].map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(adminSource, /ArabicContentWarning/);
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

test('approved bilingual public copy and activity terminology stay consistent', async () => {
  const [home, navbar, footer, about, activities, pathways] = await Promise.all([
    readFile('src/app/page.tsx', 'utf8'),
    readFile('src/components/layout/Navbar.tsx', 'utf8'),
    readFile('src/components/layout/Footer.tsx', 'utf8'),
    readFile('src/app/about/page.tsx', 'utf8'),
    readFile('src/app/activities/page.tsx', 'utf8'),
    readFile('src/components/home/HomeShowcase.tsx', 'utf8'),
  ]);
  assert.match(home, /Advancing osteopathic practice in Egypt/);
  assert.match(home, /نرتقي بممارسة الأوستيوباثي في مصر/);
  assert.match(home, /Find an osteopath/);
  assert.match(home, /Explore courses and training/);
  assert.match(navbar, /Find an Osteopath/);
  assert.match(navbar, /ابحث عن ممارس/);
  assert.match(navbar, /Activities & Events/);
  assert.doesNotMatch(navbar, /For the Public|News & Events|للجمهور|الأخبار والفعاليات/);
  assert.match(footer, /EGSOM supports osteopathic education, professional standards, and public understanding in Egypt\./);
  assert.doesNotMatch(footer, /research across Egypt|Middle East/);
  assert.match(about, /Advancing osteopathic practice in Egypt/);
  assert.doesNotMatch(about, /Advancing healthcare|across the Middle East/);
  assert.match(activities, /Activities & Events temporarily unavailable/);
  assert.match(pathways, /I need an osteopath/);
  assert.match(pathways, /أحتاج إلى ممارس أوستيوباثي/);
  assert.match(pathways, /Find an osteopath/);
  assert.match(pathways, /ابحث عن ممارس أوستيوباثي/);
});

test('interior empty states provide approved bilingual contact actions', async () => {
  const [courses, activities] = await Promise.all([
    readFile('src/app/courses/page.tsx', 'utf8'),
    readFile('src/app/activities/page.tsx', 'utf8'),
  ]);
  assert.match(courses, /href="\/contact"/);
  assert.match(courses, /Ask about upcoming programs/);
  assert.match(courses, /استفسر عن البرامج القادمة/);
  assert.match(activities, /href="\/contact"/);
  assert.match(activities, /Ask about upcoming activities/);
  assert.match(activities, /استفسر عن الأنشطة القادمة/);
});
