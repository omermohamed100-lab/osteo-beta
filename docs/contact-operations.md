# Contact operations

## Required configuration

The application no longer supplies example or fallback SMTP credentials. Configure all of these values in the deployment environment without committing their contents:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SMTP_SECURE` (optional; `true` or `false`, otherwise inferred from port 465)
- `RATE_LIMIT_SECRET` (shared with the privacy-preserving contact rate and duplicate keys)

SMTP connections require authenticated TLS, certificate validation, TLS 1.2 or newer, and bounded connection, greeting, and socket timeouts. `SMTP_FROM` and the administrator notification recipient must be valid non-placeholder mailboxes.

The schema no longer assigns `no-reply@example.com` to newly created site settings. Existing database rows are not rewritten by the migration; the owner must replace any historical placeholder with a verified official address before deployment.

No SMTP provider credential is stored in source control. When SMTP is not configured, contact receipts remain stored and visible in the admin Messages page, while notification health is reported as degraded. CAPTCHA and durable queue infrastructure remain unnecessary at the current traffic level unless the existing abuse controls prove insufficient.

## Receipt and notification semantics

A successful public response means the database accepted the submission. It does not claim the administrator email notification was delivered.

Each stored submission has one internal notification state:

- `pending`: the receipt was stored but the notification outcome is not yet known.
- `sent`: the SMTP transport accepted the notification request.
- `failed`: configuration, recipient, settings lookup, or transport delivery failed.

The admin Messages page displays this state. It intentionally does not expose SMTP errors, credentials, or provider responses. A database receipt is preserved when notification fails.

The current implementation performs one bounded notification attempt during the request. A durable queue and retry policy remain deferred because they require an approved infrastructure and operating model.

## Abuse controls

- Request bodies are streamed through a 32 KiB upper bound.
- Names are limited to 100 characters, email addresses to 254, and messages to 5,000.
- A hidden honeypot silently accepts obvious automated submissions without storing or emailing them.
- Existing PostgreSQL-backed per-address and per-email limits remain in force.
- Identical normalized content is reserved with an HMAC key for ten minutes. Concurrent duplicates receive the same generic receipt response and do not create another submission or email.

Honeypot and duplicate responses are deliberately indistinguishable from a normal receipt to avoid teaching automated clients how the controls work.

## Migration and rollout

The additive migration `20260814040000_contact_delivery_and_deduplication` was created but not applied. Production rollout order is:

1. Confirm the earlier session/rate-limit migration has succeeded.
2. Back up the database.
3. Confirm the Vercel production build runs `npm run build:vercel`, which applies pending migrations before compiling the application.
4. Configure and validate SMTP values using a non-production recipient.
5. Deploy the application.
6. Submit one controlled production check and confirm both the stored receipt and admin-visible notification state. Sending that check requires separate authorization.

## Rollback

Roll back the application before changing the schema. Retaining the additive columns and dedupe table is the safest database rollback. If they must later be removed, use a separately reviewed migration to drop the dedupe foreign key and table, then the four notification columns. Removing the status columns discards delivery history; removing the dedupe table immediately permits repeated identical submissions.

The public bilingual privacy notice now describes purpose, service providers, requests, and necessity-based retention. Automated deletion is intentionally not enabled because deleting contact records requires an approved fixed retention period; authorized administrators should review stored messages periodically until that policy is adopted.
