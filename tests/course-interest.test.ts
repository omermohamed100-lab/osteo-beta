import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { courseInterestSchema } from '../src/lib/course-interest';

const read = (path: string) => readFileSync(path, 'utf8');

test('course interest validation normalizes email and requires explicit consent', () => {
  const parsed = courseInterestSchema.parse({ email: ' Person@Example.COM ', topic: '  Foundations  ', consentNotifications: true, website: '' });
  assert.equal(parsed.email, 'person@example.com');
  assert.equal(parsed.topic, 'Foundations');
  assert.equal(courseInterestSchema.safeParse({ email: 'person@example.com', topic: '', consentNotifications: false, website: '' }).success, false);
  assert.equal(courseInterestSchema.safeParse({ email: 'person@example.com', topic: 'x'.repeat(121), consentNotifications: true, website: '' }).success, false);
});

test('API persists before notification and protects the admin queue', () => {
  const route = read('src/app/api/course-interests/route.ts');
  assert.ok(route.indexOf('db.courseInterest.create') < route.indexOf('sendEmail({'));
  assert.match(route, /requireAdmin\(request\)/);
  assert.match(route, /enforceMutationRequest\(request\)/);
  assert.match(route, /readBoundedJsonBody/);
  assert.match(route, /Invalid input data/);
  assert.doesNotMatch(route, /error\.message/);
});

test('bilingual UI links privacy and tracks conversion only after server success', () => {
  const form = read('src/components/courses/CourseInterestForm.tsx');
  assert.match(form, /Notify me about the next course/);
  assert.match(form, /أبلغني بالدورة القادمة/);
  assert.match(form, /consentNotifications/);
  assert.match(form, /href="\/privacy"/);
  assert.ok(form.indexOf("if (!response.ok)") < form.indexOf("safeTrack('education_interest_received'"));
  assert.doesNotMatch(form, /safeTrack\([^\n]+email|safeTrack\([^\n]+topic/);
});

test('schema migration and protected admin view expose stored receipts', () => {
  assert.match(read('database/schema.prisma'), /model CourseInterest/);
  assert.match(read('database/migrations/20260905020000_course_interest_capture/migration.sql'), /CREATE TABLE "CourseInterest"/);
  assert.match(read('src/app/admin/course-interests/page.tsx'), /\/api\/course-interests/);
});
