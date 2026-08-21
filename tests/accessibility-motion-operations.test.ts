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

test('mobile navigation preserves scroll, traps focus, and keeps narrow branding compact', async () => {
  const source = await readFile('src/components/layout/Navbar.tsx', 'utf8');
  assert.match(source, /const scrollPosition = window\.scrollY/);
  assert.match(source, /body\.style\.position = 'fixed'/);
  assert.match(source, /window\.scrollTo\(0, scrollPosition\)/);
  assert.match(source, /element\.inert = true/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /event\.key !== 'Tab'/);
  assert.match(source, /menuButtonRef\.current\?\.focus\(\)/);
  assert.match(source, /site-navbar fixed top-0/);
  assert.match(source, /min-\[480px\]:hidden[\s\S]*EGSOM/);
  assert.match(source, /h-11 w-11/);
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

test('Phase 6 motion uses restrained timing, an interruptible spring, and solid accessibility fallbacks', async () => {
  const [hero, navbar, styles] = await Promise.all([
    readFile('src/components/home/HeroVisual.tsx', 'utf8'),
    readFile('src/components/layout/Navbar.tsx', 'utf8'),
    readFile('src/app/globals.css', 'utf8'),
  ]);
  assert.match(hero, /}, 70\);/);
  assert.match(navbar, /type: 'spring' as const, bounce: 0, duration: 0\.3/);
  assert.match(navbar, /exit=\{reduceMotion \? \{ opacity: 0 \} : \{ opacity: 0, y: -10, scale: 0\.985 \}\}/);
  assert.match(styles, /mobileHandsRise 600ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(styles, /background: oklch\(15\.5% 0\.035 238 \/ 90%\)/);
  assert.match(styles, /backdrop-filter: blur\(18px\) saturate\(1\.12\)/);
  assert.match(styles, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*backdrop-filter: none/);
  assert.match(styles, /@media \(prefers-contrast: more\)[\s\S]*\.site-navbar\.is-scrolled[\s\S]*backdrop-filter: none/);
});

test('mobile hero artwork and education action retain their intentional stacking', async () => {
  const styles = await readFile('src/app/globals.css', 'utf8');
  assert.match(styles, /@media \(max-width: 767px\)[\s\S]*height: 21rem;[\s\S]*background-position: 84% center/);
  assert.match(styles, /\.hero-mobile-hands[\s\S]*top: 33%/);
  assert.match(styles, /\.path-panel--light \.path-panel-action[\s\S]*margin-bottom: clamp\(5\.5rem, calc\(67vw - 8rem\), 8\.5rem\)/);
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
