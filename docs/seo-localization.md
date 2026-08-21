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

The canonical production origin is `https://eg-som.com`.

After Vercel marks both custom domains as verified, set this Production-only
environment variable and redeploy:

```dotenv
NEXT_PUBLIC_SITE_URL=https://eg-som.com
```

Until that variable is set, Vercel deployments deliberately use
`https://osteo-beta.vercel.app` as the stable canonical fallback. Invalid or
insecure configured values are ignored. Outside Vercel, the resolver next tries
`VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`; local builds finally fall
back to `http://localhost:3000`.

Verify this value before deployment because it controls absolute canonical,
Open Graph, sitemap, robots, logo, and structured-data URLs.

The production health workflow uses a separate GitHub Actions repository
variable because Vercel environment variables are not available to scheduled
GitHub workflows:

```dotenv
PRODUCTION_SITE_URL=https://eg-som.com
```

Leave that repository variable unset until the custom domain passes the checks
below. The workflow then monitors `https://osteo-beta.vercel.app/api/health` as
its fallback.

## GoDaddy and Vercel cutover

The following values were observed for this domain and project on 2026-08-21.

In GoDaddy **DNS Management** for `eg-som.com`:

| Action | Type | Name | Value | TTL |
| --- | --- | --- | --- | --- |
| Delete | A | `@` | `64.29.17.1` | existing |
| Keep | A | `@` | `216.198.79.1` | 1 hour/default |
| Keep | CNAME | `www` | `68fdc3b3fb7df908.vercel-dns-017.com` | 1 hour/default |

Do not change the `ns31.domaincontrol.com` / `ns32.domaincontrol.com`
nameservers or unrelated MX/TXT records. The extra `64.29.17.1` apex record can
send some visitors away from Vercel and must be removed.

In Vercel **osteo-beta → Settings → Domains**:

1. Keep `eg-som.com` assigned to Production and make it the primary domain.
2. Keep `www.eg-som.com` assigned to the project and configure a permanent
   redirect to `https://eg-som.com`.
3. Keep `osteo-beta.vercel.app` enabled as the fallback; do not remove it.
4. In **Settings → Environment Variables**, add
   `NEXT_PUBLIC_SITE_URL=https://eg-som.com` for Production only after both
   custom-domain entries show **Valid Configuration** and their certificates
   are active. Redeploy Production after saving it.

In GitHub **Settings → Secrets and variables → Actions → Variables**, add
`PRODUCTION_SITE_URL=https://eg-som.com` after the same verification, then run
the **Production Health** workflow manually once.

Verify the cutover with:

```text
https://eg-som.com/robots.txt
https://eg-som.com/sitemap.xml
https://eg-som.com/api/health
```

`robots.txt` must report `Host: https://eg-som.com`, sitemap entries must all
start with `https://eg-som.com/`, and the health endpoint must return HTTP 200.

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
