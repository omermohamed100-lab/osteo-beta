import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { practitionerApplicationSchema } from '../src/lib/practitioner-application';

const validApplication = {
  applicationType: 'new_listing',
  name: 'Dr Test Practitioner',
  nameAr: 'د. ممارس تجريبي',
  email: 'TEST@EXAMPLE.COM',
  phone: '+20 100 000 0000',
  specialty: 'Osteopathic practice',
  specialtyAr: 'ممارسة الأوستيوباثي',
  city: 'Cairo',
  cityAr: 'القاهرة',
  country: 'Egypt',
  countryAr: 'مصر',
  location: 'Downtown Cairo',
  locationAr: 'وسط القاهرة',
  bio: 'A professional biography long enough for an individual review.',
  bioAr: 'نبذة مهنية عربية كافية لمراجعة الطلب بصورة فردية.',
  profileImage: 'https://images.example.com/practitioner.webp',
  credentialType: 'Diploma',
  credentialTypeAr: 'دبلوم',
  credentialNumber: 'TEST-123',
  credentialIssuer: 'Test institution',
  credentialIssuerAr: 'مؤسسة تجريبية',
  credentialIssuedAt: '',
  credentialExpiresAt: '',
  existingProfileUrl: '',
  applicantNotes: '',
  consentAccuracy: true,
  consentPrivacy: true,
  website: '',
} as const;

test('practitioner application validation normalizes email and requires consent', () => {
  const parsed = practitionerApplicationSchema.parse(validApplication);
  assert.equal(parsed.email, 'test@example.com');
  assert.equal(parsed.credentialIssuedAt, null);
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, consentPrivacy: false }).success, false);
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, nameAr: '' }).success, false);
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, profileImage: '' }).success, false);
});

test('profile updates require the current public profile URL', () => {
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, applicationType: 'profile_update' }).success, false);
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, applicationType: 'profile_update', existingProfileUrl: 'https://eg-som.com/en/find-osteopath/test' }).success, true);
});

test('application approval creates only inactive and unverified directory drafts', async () => {
  const approval = await readFile('src/app/api/practitioner-applications/[id]/approve/route.ts', 'utf8');
  assert.match(approval, /applicationType !== 'new_listing'/);
  assert.match(approval, /credentialStatus: 'unverified'/);
  assert.match(approval, /isActive: false/);
  assert.match(approval, /profileImage: null/);
  assert.match(approval, /profile updates require manual comparison/i);
  assert.doesNotMatch(approval, /isActive: true/);
});

test('public application is bilingual, privacy-aware, and does not upload files', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');
  const page = await readFile('src/app/practitioners/apply/page.tsx', 'utf8');
  assert.match(form, /طلب إدراج ممارس|إرسال الطلب للمراجعة/);
  assert.match(form, /href="\/privacy"/);
  assert.match(`${page}\n${form}`, /never published automatically|لا تُنشر تلقائيًا/i);
  assert.doesNotMatch(form, /type="file"/);
  assert.match(page, /getLocalizedMetadata\('\/practitioners\/apply'\)/);
});

test('admin exposes an application queue and gallery previews preserve the image', async () => {
  const dashboard = await readFile('src/app/admin/dashboard/page.tsx', 'utf8');
  const sidebar = await readFile('src/components/layout/AdminSidebar.tsx', 'utf8');
  const gallery = await readFile('src/app/admin/gallery/page.tsx', 'utf8');
  assert.match(dashboard, /Open Applications/);
  assert.match(sidebar, /\/admin\/applications/);
  assert.match(gallery, /object-contain/);
  assert.doesNotMatch(gallery, /object-cover/);
  assert.match(dashboard, /M6 20h12a2 2 0 002-2V6/);
});
