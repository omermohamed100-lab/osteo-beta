# Security configuration

## Required environment values

- `JWT_SECRET`: at least 32 bytes. Configure it before starting the application. Changing it invalidates all existing admin sessions.
- `RATE_LIMIT_SECRET`: a separate random value of at least 32 bytes. It HMAC-hashes login and contact throttling keys so email addresses and client addresses are not stored in plaintext. Missing or weak configuration makes those endpoints fail closed with a temporary-unavailable response.
- `TRUSTED_ORIGINS`: optional comma-separated list of additional exact browser origins allowed to submit state-changing requests. The request's own origin is always trusted. Production entries should use HTTPS and must not include paths.
- `ALLOWED_MEDIA_HOSTS`: comma-separated hostnames approved for externally stored course, activity, gallery, and practitioner images. Do not include schemes or paths. Loopback and private-network hosts are always rejected. Local application paths beginning with a single `/` remain allowed.

Audit existing database URLs before enabling the CSP in production. External images whose host is not listed in `ALLOWED_MEDIA_HOSTS` will be blocked by the browser and cannot be saved again through the admin API.

## Request policy

Every state-changing API request must provide an allowed `Origin`. JSON mutations must use `Content-Type: application/json`. Delete and logout requests do not require a JSON body but still require an allowed origin.

## Session revocation

Every admin token carries the user's current session version. Each protected request reloads the user and rejects disabled accounts, non-admin roles, and stale session versions. Changing a password atomically increments the version, invalidating every older token; the successful password-change response receives a replacement token so the current administrator can continue working.

The schema migration is additive and was intentionally not applied as part of local implementation. Production rollout order is:

1. Configure strong `JWT_SECRET` and `RATE_LIMIT_SECRET` values.
2. Confirm the database provider's recovery/backup protection is active.
3. Deploy through Vercel. Its `build:vercel` command records the idempotent original-schema baseline, then applies `20260814030000_session_revocation_rate_limits` and every later additive migration before compiling the application.
4. Vercel aborts the new deployment if migration or build verification fails, leaving the previous production deployment active.

This order is required because the application fails closed until the new columns and rate-limit table exist.

## Distributed throttling

Rate-limit counters live in PostgreSQL rather than server memory, so all Vercel instances share the same limits. Login allows 10 requests per client address per 15 minutes and 8 failed attempts per normalized account per 15 minutes. Contact submissions allow 5 requests per client address and 3 per normalized email address per hour. Blocked responses return HTTP 429 with `Retry-After`; an unavailable rate-limit store returns HTTP 503 and performs no protected operation.

Client-address enforcement assumes the production reverse proxy overwrites `X-Real-IP` or `X-Forwarded-For`. If the hosting path changes, the owner must confirm that behavior before relying on address-based limits. Unknown addresses deliberately share a restrictive bucket.

Expired counter rows are removed during rate-limited requests. For higher traffic, move cleanup to a scheduled database job without changing the enforcement semantics.

## Session and rate-limit rollback

Roll back the application before removing the additive schema. The application version from before this work package does not use the new fields or table, so retaining them is the safest rollback. If the owner later chooses to remove them, first confirm the old application is live, then drop `RateLimitBucket`, `User.sessionVersion`, and `User.isActive` in a separately reviewed migration. Removing the table discards throttling history; removing the session version eliminates targeted token revocation.

## Local development

- `npm run dev` binds to `127.0.0.1` only.
- `npm run dev:lan` explicitly exposes the development server to the local network.

## Dependency rollback

Next.js, its ESLint configuration, and Nodemailer were upgraded as explicit package versions. Roll back one dependency group at a time by restoring its previous version and the matching lockfile, then rerun the production audit, security tests, lint, TypeScript, and build. Do not roll back to a version with a reachable high-severity advisory.

## Header rollout

The application sends CSP, anti-framing, MIME-sniffing, referrer, and permissions headers on every route. HSTS and insecure-request upgrading are production-only. If CSP blocks a required first-party feature, add only the narrow source required and verify the resulting header; do not replace the policy with a wildcard.
