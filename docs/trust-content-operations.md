# Trust content and visitor journeys

## Publishing rules

- Practitioner directory inclusion is not presented as certification.
- Credential status defaults to `unverified` and is not shown publicly.
- A verified credential requires a type, public credential number, issuing organization, and verification date.
- An expired credential is never presented as currently verified.
- Public statistics require English and Arabic labels, a named source, and a verification date. Draft statistics remain private.
- Existing unsourced homepage/About statistics were removed rather than replaced with estimates.

The website owner must review the source document and permission to publish each credential or statistic before changing its status to published or verified.

## Database rollout

Migration `20260818020000_trust_content_and_bilingual_fields` is additive. It adds bilingual CMS fields, credential-evidence fields, a course currency field, and the `PublicStatistic` table. Existing English content remains intact and new translation fields default to empty strings.

Before deployment:

1. Back up the production database.
2. Review the migration SQL.
3. Deploy through Vercel; `npm run build:vercel` runs `npx prisma migrate deploy` before the production build.
4. Confirm the admin can save English and Arabic content.
5. Leave all credentials unverified and statistics unpublished until owner-approved evidence is entered.

The migration is committed as an additive release migration and is applied by the guarded production build. A migration failure prevents the new deployment from replacing the current production deployment.

## Public journeys

- `/en/practitioners` and `/ar/practitioners` provide a real practitioner-resource destination.
- Course, activity, and practitioner listings link to localized detail pages.
- Course and activity pages provide an enquiry route and calendar export.
- Activity locations link to a map search based only on the published location text.
- Upcoming course visibility uses course dates as well as the active flag.
- Activities are labelled as upcoming, today, or past.

## Owner information still required

- Official governance, leadership, legal registration, and organizational verification details.
- Evidence and publication permission for every practitioner credential.
- Sources and verification dates for every public statistic.
- Approved Arabic translations for legacy English-only CMS records.
- Any formal membership, event registration, course capacity, or payment process.

## Rollback

Roll back application code before removing database fields. The additive columns and table may safely remain unused during a code rollback. Dropping them is destructive and should occur only after a verified backup and a separate owner-approved cleanup migration.
