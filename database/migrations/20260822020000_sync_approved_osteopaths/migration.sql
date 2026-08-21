-- Keep the four practitioner-approved public profiles manageable from the
-- database-backed admin panel. Each insert is idempotent by email and id.

INSERT INTO "Osteopath" (
  "id", "name", "nameAr", "specialty", "specialtyAr", "city", "cityAr",
  "country", "countryAr", "location", "locationAr", "phone", "email",
  "bio", "bioAr", "profileImage", "credentialType", "credentialTypeAr",
  "credentialNumber", "credentialIssuer", "credentialIssuerAr",
  "credentialStatus", "credentialVerifiedAt", "credentialExpiresAt",
  "profileReviewedAt", "isActive", "createdAt", "updatedAt"
)
SELECT
  'mariam-mohamed-sayed-gelwa',
  'Mariam Mohamed Sayed Gelwa',
  'مريم محمد سيد جلوة',
  'Visceral Osteopathy',
  'الأوستيوباثي الحشوي',
  'Cairo',
  'القاهرة',
  'Egypt',
  'مصر',
  'New Cairo: Stern Clinic, Banafsig 4, First New Cairo; Radix Clinic, 9 Ismail Kabani, Nasr City, Cairo.',
  'القاهرة الجديدة: عيادة ستيرن، البنفسج 4، التجمع الأول، القاهرة الجديدة؛ عيادة راديكس، 9 إسماعيل القباني، مدينة نصر، القاهرة.',
  '+20 110 211 1993',
  'drmariamgelwa32@gmail.com',
  'Bachelor of Physiotherapy, Cairo University (2011). Completed five years of osteopathic training at IAO Ghent, Belgium, with further training in women’s health care, the Mechanical Link Course (Scoliosis), cupping therapy, and nutrition and obesity management.',
  'بكالوريوس العلاج الطبيعي، جامعة القاهرة (2011). أتمّت خمس سنوات من التدريب في الأوستيوباثي في الأكاديمية الدولية للأوستيوباثي (IAO) في غنت، بلجيكا، مع تدريب إضافي في رعاية صحة المرأة، ودورة الرابط الميكانيكي (الجنف)، والعلاج بالحجامة، وإدارة التغذية والسمنة.',
  '/images/osteopaths/mariam-gelwa-cutout.webp',
  '', '', '', '', '', 'unverified', NULL, NULL,
  TIMESTAMP '2026-08-12 00:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Osteopath" WHERE LOWER("email") = 'drmariamgelwa32@gmail.com'
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Osteopath" (
  "id", "name", "nameAr", "specialty", "specialtyAr", "city", "cityAr",
  "country", "countryAr", "location", "locationAr", "phone", "email",
  "bio", "bioAr", "profileImage", "credentialType", "credentialTypeAr",
  "credentialNumber", "credentialIssuer", "credentialIssuerAr",
  "credentialStatus", "credentialVerifiedAt", "credentialExpiresAt",
  "profileReviewedAt", "isActive", "createdAt", "updatedAt"
)
SELECT
  'yahya-fathy-elsamman',
  'Yahya Fathy Elsamman',
  'يحيى فتحي السمان',
  'General Practice',
  'ممارسة عامة',
  'Sohag',
  'سوهاج',
  'Egypt',
  'مصر',
  'Misr Hospital, Sohag (Saturday and Tuesday, 12–4); Dr Yahya Elsamman Center, Gerga; and Zamzam Hospital, Gerga.',
  'مستشفى مصر، سوهاج (السبت والثلاثاء، 12–4)؛ مركز د. يحيى السمان، جرجا؛ ومستشفى زمزم، جرجا.',
  '+20 101 054 8390',
  'Yahya.do20@gmail.com',
  'Experienced Osteopath and Physiotherapy Specialist.',
  'ممارس أوستيوباثي وأخصائي علاج طبيعي ذو خبرة.',
  '/images/osteopaths/yahya-elsamman-cutout.webp',
  '', '', '', '', '', 'unverified', NULL, NULL,
  TIMESTAMP '2026-08-12 00:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Osteopath" WHERE LOWER("email") = 'yahya.do20@gmail.com'
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Osteopath" (
  "id", "name", "nameAr", "specialty", "specialtyAr", "city", "cityAr",
  "country", "countryAr", "location", "locationAr", "phone", "email",
  "bio", "bioAr", "profileImage", "credentialType", "credentialTypeAr",
  "credentialNumber", "credentialIssuer", "credentialIssuerAr",
  "credentialStatus", "credentialVerifiedAt", "credentialExpiresAt",
  "profileReviewedAt", "isActive", "createdAt", "updatedAt"
)
SELECT
  'loay-mohamed-monir-serour',
  'Loay Mohamed Monir Serour',
  'لؤي محمد منير سرور',
  'General Practice',
  'ممارسة عامة',
  'Cairo',
  'القاهرة',
  'Egypt',
  'مصر',
  'Menoufia: Dr Loay Serour Clinic, Al Fayrouz Tower, 1st Floor, Midan Sharaf, Shebin El-Kom. Sheikh Zayed: SODIC Medical District, Beverly Hills, Sheikh Zayed City, Giza.',
  'المنوفية: عيادة د. لؤي سرور، برج الفيروز، الطابق الأول، ميدان شرف، شبين الكوم. الشيخ زايد: منطقة سوديك الطبية، بيفرلي هيلز، مدينة الشيخ زايد، الجيزة.',
  '+20 101 606 1010',
  'loaysoror@gmail.com',
  'Orthopedic and spine specialist, with osteopathy and manual therapy training at IAO, Belgium. Focused on non-surgical care for spine and joint disorders, musculoskeletal pain, and rehabilitation.',
  'أخصائي عظام وعمود فقري، حاصل على تدريب في الأوستيوباثي والعلاج اليدوي في الأكاديمية الدولية للأوستيوباثي (IAO)، بلجيكا. يركز على الرعاية غير الجراحية لاضطرابات العمود الفقري والمفاصل، وآلام الجهاز العضلي الهيكلي، وإعادة التأهيل.',
  '/images/osteopaths/loay-serour-cutout.webp',
  '', '', '', '', '', 'unverified', NULL, NULL,
  TIMESTAMP '2026-08-12 00:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Osteopath" WHERE LOWER("email") = 'loaysoror@gmail.com'
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Osteopath" (
  "id", "name", "nameAr", "specialty", "specialtyAr", "city", "cityAr",
  "country", "countryAr", "location", "locationAr", "phone", "email",
  "bio", "bioAr", "profileImage", "credentialType", "credentialTypeAr",
  "credentialNumber", "credentialIssuer", "credentialIssuerAr",
  "credentialStatus", "credentialVerifiedAt", "credentialExpiresAt",
  "profileReviewedAt", "isActive", "createdAt", "updatedAt"
)
SELECT
  'samira-sayed-mahmoud',
  'Samira Sayed Mahmoud',
  'سميرة سيد محمود',
  'General Practice',
  'ممارسة عامة',
  'Cairo',
  'القاهرة',
  'Egypt',
  'مصر',
  'Not available right now.',
  'غير متاح حاليًا.',
  '+20 100 839 2867',
  'meros.frd@gmail.com',
  'Diploma of Osteopathy; Bachelor of Physical Therapy.',
  'دبلوم في الأوستيوباثي؛ بكالوريوس العلاج الطبيعي.',
  '/images/osteopaths/samira-mahmoud-cutout.webp',
  '', '', '', '', '', 'unverified', NULL, NULL,
  TIMESTAMP '2026-08-12 00:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Osteopath" WHERE LOWER("email") = 'meros.frd@gmail.com'
)
ON CONFLICT ("id") DO NOTHING;
