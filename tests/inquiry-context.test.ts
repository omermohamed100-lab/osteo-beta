import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  inquiryHref,
  messageWithInquiryContext,
  parseInquiryContext,
} from '../src/lib/inquiry-context';

test('course and activity inquiry links retain safe listing context', () => {
  const href = inquiryHref({
    type: 'course',
    id: 'course_123',
    title: 'Clinical Course',
    titleAr: 'دورة سريرية',
  });
  const context = parseInquiryContext(new URL(href, 'https://example.test').searchParams);

  assert.deepEqual(context, {
    type: 'course', id: 'course_123', title: 'Clinical Course', titleAr: 'دورة سريرية',
  });
});

test('inquiry parsing rejects unknown types and strips control characters', () => {
  assert.equal(parseInquiryContext(new URLSearchParams('inquiry=other&title=Anything')), null);
  const context = parseInquiryContext(new URLSearchParams({
    inquiry: 'activity', id: '../unsafe', title: 'Title\r\nBcc: attacker@example.test',
  }));

  assert.equal(context?.id, undefined);
  assert.equal(context?.title, 'Title Bcc: attacker@example.test');
  assert.doesNotMatch(messageWithInquiryContext('Question', context), /\r|\nBcc:/);
});

test('all listing and empty-state inquiry CTAs carry context into contact', async () => {
  const [actions, courses, activities, contact] = await Promise.all([
    readFile('src/components/public/PublicRecordActions.tsx', 'utf8'),
    readFile('src/app/courses/page.tsx', 'utf8'),
    readFile('src/app/activities/page.tsx', 'utf8'),
    readFile('src/app/contact/page.tsx', 'utf8'),
  ]);

  assert.match(actions, /inquiryHref\(\{ type: inquiryType, id: listingId, title, titleAr \}\)/);
  assert.match(courses, /inquiryHref\(\{ type: 'upcoming-courses' \}\)/);
  assert.match(activities, /inquiryHref\(\{ type: 'upcoming-activities' \}\)/);
  assert.match(contact, /messageWithInquiryContext\(form\.message, inquiryContext\)/);
  assert.match(contact, /What would you like to know\?/);
  assert.match(contact, /ما الذي تود معرفته؟/);
});
