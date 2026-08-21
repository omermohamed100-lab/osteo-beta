import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import {
  PUBLIC_PAGE_PATHS,
  getLanguageFromPathname,
  getPublicPathFromPathname,
  localizePublicHref,
  localizePublicPath,
} from '../src/lib/i18n-routing';
import { buildLocalizedMetadata } from '../src/lib/localized-metadata';
import { PUBLIC_PAGE_META } from '../src/lib/public-page-meta';
import { proxy } from '../src/proxy';

test('public routes have stable English and Arabic URL variants', () => {
  assert.equal(localizePublicPath('/', 'en'), '/en');
  assert.equal(localizePublicPath('/', 'ar'), '/ar');
  assert.equal(localizePublicPath('/about', 'ar'), '/ar/about');
  assert.equal(localizePublicPath('/en/about', 'ar'), '/ar/about');
  assert.equal(localizePublicHref('/courses?level=1#list', 'ar'), '/ar/courses?level=1#list');
  assert.equal(localizePublicHref('/admin/login', 'ar'), '/admin/login');
  assert.equal(localizePublicHref('mailto:info@example.com', 'ar'), 'mailto:info@example.com');
  assert.equal(getLanguageFromPathname('/ar/activities'), 'ar');
  assert.equal(getPublicPathFromPathname('/ar/activities'), '/activities');
});

test('every public route has complete, distinct localized metadata', () => {
  for (const pathname of PUBLIC_PAGE_PATHS) {
    const pageMeta = PUBLIC_PAGE_META[pathname];
    assert.ok(pageMeta, `Missing metadata for ${pathname}`);
    assert.ok(pageMeta.en.title);
    assert.ok(pageMeta.en.description);
    assert.ok(pageMeta.ar.title);
    assert.ok(pageMeta.ar.description);
    assert.notEqual(pageMeta.en.title, pageMeta.ar.title);
  }
});

test('localized metadata emits canonical, hreflang, Open Graph, and Twitter data', () => {
  const metadata = buildLocalizedMetadata(
    '/courses',
    'ar',
    new URL('https://example.test'),
  );

  assert.equal(metadata.alternates?.canonical, '/ar/courses');
  assert.deepEqual(metadata.alternates?.languages, {
    en: '/en/courses',
    ar: '/ar/courses',
    'x-default': '/en/courses',
  });
  assert.equal(metadata.openGraph?.url, '/ar/courses');
  assert.equal(metadata.openGraph?.locale, 'ar_EG');
  assert.ok(metadata.twitter && 'card' in metadata.twitter);
  assert.equal(metadata.twitter.card, 'summary_large_image');
});

test('proxy permanently redirects legacy URLs and rewrites localized URLs', () => {
  const legacyResponse = proxy(new NextRequest('https://example.test/activities?type=event', {
    headers: { 'x-egsom-locale': 'ar' },
  }));
  assert.equal(legacyResponse.status, 308);
  assert.equal(
    legacyResponse.headers.get('location'),
    'https://example.test/en/activities?type=event',
  );

  const localizedResponse = proxy(new NextRequest('https://example.test/ar/activities'));
  assert.equal(localizedResponse.status, 200);
  assert.equal(
    localizedResponse.headers.get('x-middleware-rewrite'),
    'https://example.test/activities',
  );
  assert.equal(localizedResponse.headers.get('content-language'), 'ar');
  assert.match(localizedResponse.headers.get('set-cookie') ?? '', /\bSecure\b/);
  assert.equal(
    localizedResponse.headers.get('x-middleware-request-x-egsom-internal-localized-rewrite'),
    'ar',
  );

  const internalRewriteResponse = proxy(new NextRequest('https://example.test/activities', {
    headers: {
      'x-egsom-internal-localized-rewrite': 'ar',
      'x-egsom-locale': 'ar',
    },
  }));
  assert.equal(internalRewriteResponse.status, 200);
  assert.equal(internalRewriteResponse.headers.get('location'), null);
  assert.equal(internalRewriteResponse.headers.get('x-middleware-rewrite'), null);
  assert.equal(internalRewriteResponse.headers.get('content-language'), 'ar');
  assert.equal(
    internalRewriteResponse.headers.get('x-middleware-request-x-egsom-locale'),
    'ar',
  );
  assert.equal(
    internalRewriteResponse.headers.get('x-middleware-request-x-egsom-internal-localized-rewrite'),
    null,
  );

  const localizedNotFoundResponse = proxy(
    new NextRequest('https://example.test/ar/does-not-exist'),
  );
  assert.equal(localizedNotFoundResponse.status, 200);
  assert.equal(localizedNotFoundResponse.headers.get('x-middleware-rewrite'), null);
  assert.equal(localizedNotFoundResponse.headers.get('content-language'), 'ar');
  assert.equal(
    localizedNotFoundResponse.headers.get('x-middleware-request-x-egsom-locale'),
    'ar',
  );
});
