import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('courses keeps upcoming, past, empty, and outage states distinct', async () => {
  const page = await readFile('src/app/courses/page.tsx', 'utf8');
  assert.match(page, /endDate: \{ lt: today \}/);
  assert.match(page, /endDate: null, startDate: \{ lt: today \}/);
  assert.match(page, /isActive: true/);
  assert.match(page, /Previous programs/);
  assert.match(page, /البرامج السابقة/);
  assert.match(page, /historical references, not current offers/i);
  assert.match(page, /previousUnavailable/);
  assert.match(page, /No courses are currently scheduled/);
  assert.ok(page.indexOf('<CourseInterestForm') < page.indexOf('Who can apply?'));
});

test('education guidance is bilingual, evidence-bounded, and contextually linked', async () => {
  const page = await readFile('src/app/courses/page.tsx', 'utf8');
  assert.match(page, /Who can apply\?/);
  assert.match(page, /من يمكنه التقديم/);
  assert.match(page, /How training is delivered/);
  assert.match(page, /كيف يُقدَّم التدريب/);
  assert.match(page, /Each published listing is the source/);
  assert.match(page, /href="\/activities"/);
  assert.match(page, /href="\/practitioners"/);
  assert.match(page, /href="\/standards"/);
  assert.doesNotMatch(page, /accredited|guaranteed eligibility|all courses are/i);
});
