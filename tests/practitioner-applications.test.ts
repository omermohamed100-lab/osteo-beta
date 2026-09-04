import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { practitionerApplicationSchema } from '../src/lib/practitioner-application';

const validApplication = {
  primaryLanguage: 'en',
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
  profileImage: 'data:image/png;base64,iVBORw0KGgo=',
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
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, nameAr: '' }).success, true);
  assert.equal(practitionerApplicationSchema.safeParse({ ...validApplication, primaryLanguage: 'ar', nameAr: '' }).success, false);
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

test('public application is bilingual, privacy-aware, and uploads a bounded private image', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');
  const page = await readFile('src/app/practitioners/apply/page.tsx', 'utf8');
  assert.match(form, /طلب إدراج ممارس|إرسال الطلب للمراجعة/);
  assert.match(form, /href="\/privacy"/);
  assert.match(`${page}\n${form}`, /never published automatically|لا تُنشر تلقائيًا/i);
  assert.match(form, /type="file"/);
  assert.match(form, /image\/jpeg,image\/png,image\/webp/);
  assert.match(form, /2 \* 1024 \* 1024/);
  assert.match(page, /getLocalizedMetadata\('\/practitioners\/apply'\)/);
});

test('application uses the audited accessible staged order and private admin photo route', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');
  const photo = await readFile('src/app/api/practitioner-applications/[id]/photo/route.ts', 'utf8');
  const approval = await readFile('src/app/api/practitioner-applications/[id]/approve/route.ts', 'utf8');
  const contactStep = form.indexOf("'Contact and eligibility'}</li>");
  const credentialsStep = form.indexOf("'Credentials'}</li>");
  const profileStep = form.indexOf("'Public profile'}</li>");
  assert.ok(contactStep >= 0 && contactStep < credentialsStep);
  assert.ok(credentialsStep < profileStep);
  assert.match(form, /aria-current=\{step === 0 \? 'step'/);
  assert.match(form, /goToStep\(step - 1\)/);
  assert.match(photo, /requireAdmin\(request\)/);
  assert.match(photo, /private, no-store/);
  assert.match(photo, /nosniff/);
  assert.match(approval, /Staff must complete and review both language versions/);
});

test('visible paired-field requirements follow the selected primary language', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');

  assert.match(form, /const requiresEnglish = form\.primaryLanguage === 'en'/);
  assert.match(form, /const requiresArabic = form\.primaryLanguage === 'ar'/);
  assert.match(form, /field\('name', copy\.name, \{ required: requiresEnglish/);
  assert.match(form, /field\('nameAr', copy\.nameAr, \{ required: requiresArabic/);
  assert.match(form, /required=\{requiresEnglish\}/);
  assert.match(form, /required=\{requiresArabic\}/);
});

test('public application exposes localized field errors and deliberate focus targets', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');
  assert.match(form, /validationSummary: 'Review the highlighted fields below/);
  assert.match(form, /validationSummary: 'راجع الحقول الموضحة أدناه/);
  assert.match(form, /aria-describedby=\{describedBy\}/);
  assert.match(form, /focusFirstInvalid\(errors\)/);
  assert.match(form, /successTitleRef\.current\?\.focus\(\)/);
  assert.match(form, /aria-labelledby="application-success-title"/);
});

test('bilingual professional fields preserve explicit writing direction', async () => {
  const form = await readFile('src/components/practitioners/PractitionerApplicationForm.tsx', 'utf8');
  assert.match(form, /field\('name'.*dir: 'ltr'.*lang: 'en'/);
  assert.match(form, /field\('nameAr'.*dir: 'rtl'.*lang: 'ar'/);
  assert.match(form, /field\('credentialIssuer'.*dir: 'ltr'.*lang: 'en'/);
  assert.match(form, /field\('credentialIssuerAr'.*dir: 'rtl'.*lang: 'ar'/);
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
