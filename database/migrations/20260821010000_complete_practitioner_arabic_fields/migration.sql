-- Add the remaining Arabic practitioner fields without changing existing English data.
ALTER TABLE "Osteopath"
  ADD COLUMN "nameAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "cityAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "countryAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialTypeAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialIssuerAr" TEXT NOT NULL DEFAULT '';

-- Translate stable geographic values conservatively for existing records.
UPDATE "Osteopath"
SET "cityAr" = CASE "city"
  WHEN 'Cairo' THEN 'القاهرة'
  WHEN 'Sohag' THEN 'سوهاج'
  WHEN 'Menoufia' THEN 'المنوفية'
  ELSE "cityAr"
END
WHERE "cityAr" = '';

UPDATE "Osteopath"
SET "countryAr" = 'مصر'
WHERE "countryAr" = '' AND "country" = 'Egypt';

-- Backfill the four practitioner-approved public profiles by their existing email identities.
UPDATE "Osteopath"
SET
  "nameAr" = CASE WHEN "nameAr" = '' THEN 'مريم محمد سيد جلوة' ELSE "nameAr" END,
  "specialtyAr" = CASE WHEN "specialtyAr" = '' THEN 'الأوستيوباثي الحشوي' ELSE "specialtyAr" END,
  "locationAr" = CASE WHEN "locationAr" = '' THEN 'القاهرة الجديدة: عيادة ستيرن، البنفسج 4، التجمع الأول، القاهرة الجديدة؛ عيادة راديكس، 9 إسماعيل القباني، مدينة نصر، القاهرة.' ELSE "locationAr" END,
  "bioAr" = CASE WHEN "bioAr" = '' THEN 'بكالوريوس العلاج الطبيعي، جامعة القاهرة (2011). أتمّت خمس سنوات من التدريب في الأوستيوباثي في الأكاديمية الدولية للأوستيوباثي (IAO) في غنت، بلجيكا، مع تدريب إضافي في رعاية صحة المرأة، ودورة الرابط الميكانيكي (الجنف)، والعلاج بالحجامة، وإدارة التغذية والسمنة.' ELSE "bioAr" END
WHERE LOWER("email") = 'drmariamgelwa32@gmail.com';

UPDATE "Osteopath"
SET
  "nameAr" = CASE WHEN "nameAr" = '' THEN 'يحيى فتحي السمان' ELSE "nameAr" END,
  "specialtyAr" = CASE WHEN "specialtyAr" = '' THEN 'ممارسة عامة' ELSE "specialtyAr" END,
  "locationAr" = CASE WHEN "locationAr" = '' THEN 'مستشفى مصر، سوهاج (السبت والثلاثاء، 12–4)؛ مركز د. يحيى السمان، جرجا؛ ومستشفى زمزم، جرجا.' ELSE "locationAr" END,
  "bioAr" = CASE WHEN "bioAr" = '' THEN 'ممارس أوستيوباثي وأخصائي علاج طبيعي ذو خبرة.' ELSE "bioAr" END
WHERE LOWER("email") = 'yahya.do20@gmail.com';

UPDATE "Osteopath"
SET
  "nameAr" = CASE WHEN "nameAr" = '' THEN 'لؤي محمد منير سرور' ELSE "nameAr" END,
  "specialtyAr" = CASE WHEN "specialtyAr" = '' THEN 'ممارسة عامة' ELSE "specialtyAr" END,
  "locationAr" = CASE WHEN "locationAr" = '' THEN 'المنوفية: عيادة د. لؤي سرور، برج الفيروز، الطابق الأول، ميدان شرف، شبين الكوم. الشيخ زايد: منطقة سوديك الطبية، بيفرلي هيلز، مدينة الشيخ زايد، الجيزة.' ELSE "locationAr" END,
  "bioAr" = CASE WHEN "bioAr" = '' THEN 'أخصائي عظام وعمود فقري، حاصل على تدريب في الأوستيوباثي والعلاج اليدوي في الأكاديمية الدولية للأوستيوباثي (IAO)، بلجيكا. يركز على الرعاية غير الجراحية لاضطرابات العمود الفقري والمفاصل، وآلام الجهاز العضلي الهيكلي، وإعادة التأهيل.' ELSE "bioAr" END
WHERE LOWER("email") = 'loaysoror@gmail.com';

UPDATE "Osteopath"
SET
  "nameAr" = CASE WHEN "nameAr" = '' THEN 'سميرة سيد محمود' ELSE "nameAr" END,
  "specialtyAr" = CASE WHEN "specialtyAr" = '' THEN 'ممارسة عامة' ELSE "specialtyAr" END,
  "locationAr" = CASE WHEN "locationAr" = '' THEN 'غير متاح حاليًا.' ELSE "locationAr" END,
  "bioAr" = CASE WHEN "bioAr" = '' THEN 'دبلوم في الأوستيوباثي؛ بكالوريوس العلاج الطبيعي.' ELSE "bioAr" END
WHERE LOWER("email") = 'meros.frd@gmail.com';

UPDATE "SiteSettings"
SET "addressAr" = 'القاهرة، مصر'
WHERE "addressAr" = '' AND "address" = 'Cairo, Egypt';
