# Submission and operations checks

## Deployment

Deploy through the existing `build:vercel` command, which applies migrations before building. The additive `20260916010000_submission_resilience` migration adds duplicate reservations and pagination indexes. It does not delete or rewrite existing submissions. Do not deploy only the new application code without its migration: course-interest and practitioner submissions fail closed when the reservation tables are unavailable.

Identical validated submissions reserve an HMAC key for ten minutes. The receipt and reservation are created in one nested database transaction. Simultaneous duplicates roll back their extra receipts and receive the normal acknowledgement, without another email. Changed content is a new submission. Existing per-address and per-email limits still apply, including to retries. Expired reservations are cleaned up on subsequent submissions. Roll back application code while leaving the additive tables intact if needed.

The contact, course-interest, and application admin GET endpoints now return `{ items, nextCursor }`, default to 25 records, and accept at most 100 per request. Application status filters are applied on the server. Cursors contain only the sort timestamp and record ID, and all endpoints still require an active admin session. Application lists and review responses include `photoData`, `photoMediaType`, `photoOriginalName`, and legacy `profileImage` values. The authenticated photo endpoint also remains available for direct image previews.

Public forms allow 30 seconds for headers and response bodies. A timeout does not prove the server rejected the submission. The form retains its fields, explains that confirmation was not received, and lets the visitor retry. Mutations are never retried automatically. Navigating away cancels the browser request. Admin lists distinguish unavailable data from an empty page and allow retrying.

## Automated verification

- `npm run check`: lint, TypeScript, existing tests, cursor/input bounds, deduplication classification and identity, and timeout/cancellation behavior.
- `npm run build`: production compilation.
- `npm run audit:prod`: dependency advisories.
- `npm run test:resilience:db`: real PostgreSQL concurrency and pagination checks. Requires `RESILIENCE_TEST_DATABASE_URL` pointing to a local database named `egsom_resilience_test` with migrations applied. It never falls back to the application's `DATABASE_URL`. Fixtures use unique IDs and are removed after the tests. GitHub Actions provisions this isolated database in the `database-resilience` job.
- `npm run test:concurrency`: 48 read-only requests, eight at a time, against a local running site. Defaults to port 3100; override with `SMOKE_SITE_URL`. It warms the routes, fails on non-successful responses, and prints p95 latency without logging bodies or credentials. This is a smoke test, not a production capacity estimate.

## Hosting settings to verify

These settings cannot be established by changing repository code:

1. Check the hosting, database, and SMTP account budgets, usage alerts, and recipients. In Vercel, review Spend Management and choose whether exceeding the budget should pause production; pausing causes downtime. Check separate provider limits too.
2. Confirm the production health workflow actually runs and that failures reach an operator. A committed schedule alone is not proof of delivery.
3. Confirm database backups are enabled, their retention period is sufficient, and private submitted photos are included (they currently reside in PostgreSQL).

## Backup restore exercise

1. Record the backup timestamp and recovery objective. Provision a separate private database that has no production application connected to it.
2. Restore a provider snapshot or PostgreSQL backup into that database. Never point the restore command at the production connection string.
3. Run schema checks and compare record counts with the backup's expected snapshot. Check a sample of contact receipts, application review states, course interests, and private photo bytes without logging their contents.
4. Connect an isolated staging app to the restored database. Disable outbound email and public access. Confirm an authorized administrator can read the restored queues and private photos.
5. Record the result, elapsed restore time, backup age, and any errors in the private operations record. Remove the temporary restore environment through the provider's normal workflow when it is no longer needed.

This runbook is not evidence that production backups or alerts have been verified.
