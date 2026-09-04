-- Apply the practitioner-approved missing-address wording without changing any
-- other profile or inferring a practice location.
UPDATE "Osteopath"
SET
  "location" = 'Practice address not provided. Contact this practitioner for location details.',
  "locationAr" = 'لم يُقدَّم عنوان الممارسة. تواصل مع الممارِسة للحصول على تفاصيل الموقع.'
WHERE LOWER("email") = 'meros.frd@gmail.com'
  AND "location" = 'Not available right now.';
