-- Remove only the known demonstration contact values from the production row.
-- Empty values are intentionally hidden by the public footer until the owner
-- enters verified official contact details through the admin interface.
UPDATE "SiteSettings"
SET "email" = ''
WHERE LOWER(TRIM("email")) IN (
  'no-reply@example.com',
  'noreply@example.com'
);

UPDATE "SiteSettings"
SET "phone" = ''
WHERE REGEXP_REPLACE("phone", '[^0-9+]', '', 'g') IN (
  '+201234567890',
  '201234567890'
);
