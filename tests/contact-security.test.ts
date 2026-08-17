import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {
  CONTACT_BODY_MAX_BYTES,
  CONTACT_DEDUPE_WINDOW_MS,
  contactSubmissionSchema,
  createContactDedupeKey,
} from '../src/lib/contact-security';

const originalSecret = process.env.RATE_LIMIT_SECRET;

test.afterEach(() => {
  if (originalSecret === undefined) delete process.env.RATE_LIMIT_SECRET;
  else process.env.RATE_LIMIT_SECRET = originalSecret;
});

test('enforces strict normalized contact field limits and accepts the empty honeypot', () => {
  const parsed = contactSubmissionSchema.parse({
    name: '  Visitor  ',
    email: '  VISITOR@EGSOM.ORG ',
    message: `  ${'A'.repeat(10)}  `,
    website: '',
  });

  assert.equal(parsed.name, 'Visitor');
  assert.equal(parsed.email, 'visitor@egsom.org');
  assert.equal(parsed.message, 'A'.repeat(10));
  assert.equal(parsed.website, '');
  assert.throws(() => contactSubmissionSchema.parse({
    name: 'Visitor',
    email: 'visitor@egsom.org',
    message: 'A'.repeat(5001),
    unexpected: true,
  }));
  assert.equal(CONTACT_BODY_MAX_BYTES, 32 * 1024);
});

test('creates a privacy-preserving duplicate key for the ten-minute reservation window', () => {
  process.env.RATE_LIMIT_SECRET = 'test-only-rate-limit-secret-at-least-32-bytes';
  const first = createContactDedupeKey({
    name: 'Visitor',
    email: 'visitor@egsom.org',
    message: 'A message with  spaces.',
    website: '',
  });
  const normalized = createContactDedupeKey({
    name: 'visitor',
    email: 'VISITOR@EGSOM.ORG',
    message: 'A message with spaces.',
    website: '',
  });

  assert.equal(first, normalized);
  assert.equal(first.length, 64);
  assert.equal(CONTACT_DEDUPE_WINDOW_MS, 10 * 60 * 1000);
});

test('contact route stores before notifying and records an internal delivery state', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/app/api/contact/route.ts'),
    'utf8',
  );
  const createSubmission = source.indexOf('db.contactSubmission.create');
  const sendNotification = source.indexOf('sendEmail({');

  assert.ok(createSubmission >= 0 && createSubmission < sendNotification);
  assert.match(source, /dedupeReservation:\s*\{/);
  assert.match(source, /notificationStatus:\s*deliveryResult\.success/);
  assert.match(source, /RequestBodyTooLargeError/);
  assert.doesNotMatch(source, /no-reply@example\.com/);
});

test('visitor copy reports receipt rather than claiming email delivery', async () => {
  const source = await readFile(path.join(process.cwd(), 'src/app/contact/page.tsx'), 'utf8');

  assert.match(source, /Message received/);
  assert.match(source, /تم استلام رسالتك/);
  assert.doesNotMatch(source, /Message sent!/);
  assert.match(source, /name="website"/);
});
