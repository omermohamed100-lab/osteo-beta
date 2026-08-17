# Bilingual routing and SEO operations

## Canonical public URLs

English and Arabic use stable sub-path URLs:

- English: `/en`, `/en/about`, `/en/courses`, and the equivalent public paths.
- Arabic: `/ar`, `/ar/about`, `/ar/courses`, and the equivalent public paths.

Legacy unprefixed public URLs return a permanent `308` redirect to the matching
English URL. API, admin, and static-asset URLs are not localized.

The route prefix is the source of truth for rendered language, document
direction, navigation, canonical metadata, and social metadata. The language
cookie remains only as a compatibility preference and does not determine what
search engines receive.

## Production site URL

Set `NEXT_PUBLIC_SITE_URL` to the verified canonical HTTPS origin, without a
path. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used when the explicit value
is absent. Local builds fall back to `http://localhost:3000`.

Verify this value before deployment because it controls absolute canonical,
Open Graph, sitemap, robots, logo, and structured-data URLs.

## Indexing behavior

- Every public page emits a self-referencing canonical URL.
- Every public page links its English, Arabic, and `x-default` alternatives.
- `/sitemap.xml` contains both languages for all public page paths.
- `/robots.txt` permits public pages and excludes `/admin/` and `/api/`.
- Organization structured data contains only the visible organization name,
  acronym, canonical URL, and managed logo.

Course, Event, practitioner, breadcrumb, and contact structured data remain
deferred until visible, verified fields support those claims.

## Rollback

To roll back the URL migration, remove `src/proxy.ts`, restore ordinary public
links in the localized-link wrapper, and remove locale prefixes from canonical,
sitemap, and alternate metadata. Keep redirects only as long as the localized
URLs remain live; never reverse both redirect directions at once.
