# Operations and monitoring

## Health endpoint

`GET /api/health` is a no-store, no-index readiness endpoint intended for a deployment platform or uptime monitor. It returns only coarse service states and an observation timestamp:

- `database`: confirms that the application can execute a minimal database query.
- `email`: confirms valid SMTP configuration and evaluates the previous 24 hours of stored delivery outcomes. It becomes degraded when at least three attempts all failed.

The endpoint returns HTTP 503 when the database is unavailable because the application is not ready to accept stateful traffic. An unavailable email channel returns HTTP 200 with a degraded body because contact receipts remain stored and reviewable in the admin area. It never returns configuration values, database errors, visitor identifiers, message content, or provider responses.

Email delivery health is based on recorded outcomes rather than sending probe mail. This prevents health checks from generating email or becoming an abuse vector. A controlled end-to-end delivery check still requires explicit operational authorization.

## Operational events

The server emits allowlisted JSON events for health failures. Events contain only a fixed event code, error class name, severity, and timestamp. Do not add arbitrary context objects, exception messages, stacks, request bodies, names, email addresses, contact messages, tokens, connection strings, or SMTP responses.

The deployment log sink should alert on:

- repeated `health.database_unavailable` events;
- any `health.email_configuration_unavailable` event after deployment;
- `health.email_delivery_degraded` after the minimum attempt threshold;
- repeated HTTP 503 responses from `/api/health`.

## Active monitoring

GitHub Actions checks the production health endpoint twice per hour. A database outage fails the workflow. Email degradation produces an explicit workflow warning while preserving availability for stored contact receipts. Vercel runtime logs receive the allowlisted operational events, while Vercel Analytics and Speed Insights cover public usage and performance.

## Optional monitoring provider

No additional error-monitoring vendor is configured in source control. Selecting Sentry, Better Stack, or another vendor changes data-processing and access boundaries and remains an owner decision. Before connecting one, approve:

1. vendor and region;
2. retention period;
3. staff access;
4. sampling and alert destinations;
5. source-map policy;
6. PII scrubbing rules;
7. incident ownership and response times.

The health endpoint and structured event format are ready for that integration without exposing visitor content.

## Deployment check

After migrations and environment variables are configured, verify:

1. `/api/health` returns 200;
2. an intentionally unavailable staging database yields 503 without internal details;
3. missing staging SMTP configuration yields 503 without revealing which value is absent;
4. a separately authorized contact submission is stored and records `sent` or `failed` accurately;
5. alerts route only to approved operators.
