import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('contact validation announces a bilingual summary and focuses the first invalid field', async () => {
  const source = await readFile('src/app/contact/page.tsx', 'utf8');
  assert.match(source, /role="alert"/);
  assert.match(source, /Please correct the following fields/);
  assert.match(source, /يرجى تصحيح الحقول التالية/);
  assert.match(source, /nameRef\.current\?\.focus\(\)/);
  assert.match(source, /aria-invalid=/);
  assert.match(source, /aria-describedby=/);
  assert.doesNotMatch(source, /-left-\[10000px\]/);
});

test('gallery categories and media use semantic landmarks', async () => {
  const source = await readFile('src/app/gallery/page.tsx', 'utf8');
  assert.match(source, /<section key=\{cat\} aria-labelledby=\{headingId\}>/);
  assert.match(source, /<h2 id=\{headingId\}/);
  assert.match(source, /<figure key=\{item\.id\}/);
  assert.match(source, /<figcaption/);
});

test('public status messages are announced and reduced motion remains informative', async () => {
  const [notice, directory, styles] = await Promise.all([
    readFile('src/components/public/PublicDataUnavailable.tsx', 'utf8'),
    readFile('src/app/find-osteopath/page.tsx', 'utf8'),
    readFile('src/app/globals.css', 'utf8'),
  ]);
  assert.match(notice, /aria-live="polite"/);
  assert.match(directory, /role="status"/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.status-spinner[\s\S]*animation-duration: 1800ms/);
  assert.doesNotMatch(styles, /\.surface-card:active/);
});

test('health reporting is no-store and operational logs exclude sensitive payloads', async () => {
  const [route, monitoring] = await Promise.all([
    readFile('src/app/api/health/route.ts', 'utf8'),
    readFile('src/lib/operational-monitoring.ts', 'utf8'),
  ]);
  assert.match(route, /no-store/);
  assert.match(route, /SELECT 1/);
  assert.match(route, /notificationStatus: 'failed'/);
  assert.match(route, /status: ready \? 200 : 503/);
  assert.doesNotMatch(monitoring, /error\.message|error\.stack/);
  assert.doesNotMatch(monitoring, /name:|email:|message:/);
});

test('not-found and render failures have accessible bilingual recovery states', async () => {
  const [notFound, routeError, globalError] = await Promise.all([
    readFile('src/app/not-found.tsx', 'utf8'),
    readFile('src/app/error.tsx', 'utf8'),
    readFile('src/app/global-error.tsx', 'utf8'),
  ]);
  assert.match(notFound, /Page not found/);
  assert.match(notFound, /الصفحة غير موجودة/);
  assert.match(routeError, /role="alert"/);
  assert.match(routeError, /تعذر عرض هذه الصفحة/);
  assert.match(globalError, /الموقع غير متاح مؤقتًا/);
});
