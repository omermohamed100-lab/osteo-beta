ALTER TABLE "SiteSettings"
  ALTER COLUMN "email" SET DEFAULT 'support@eg-som.com',
  ADD COLUMN "youtube" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "x" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "whatsapp" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "facebookEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "youtubeEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "linkedinEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "xEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "facebookOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "youtubeOrder" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "linkedinOrder" INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN "xOrder" INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN "whatsappOrder" INTEGER NOT NULL DEFAULT 4,
  ADD COLUMN "heroEyebrow" TEXT NOT NULL DEFAULT 'EGYPTIAN SOCIETY OF OSTEOPATHIC MEDICINE',
  ADD COLUMN "heroEyebrowAr" TEXT NOT NULL DEFAULT 'الجمعية المصرية لطب الأوستيوباثي',
  ADD COLUMN "heroHeadline" TEXT NOT NULL DEFAULT 'Find an osteopath. Explore training in Egypt.',
  ADD COLUMN "heroHeadlineAr" TEXT NOT NULL DEFAULT 'ابحث عن ممارس أوستيوباثي. واستكشف التدريب في مصر.',
  ADD COLUMN "heroDescription" TEXT NOT NULL DEFAULT 'EGSOM advances awareness, education, and professional osteopathic practice in Egypt, supporting practitioners across Egypt and the Middle East through training, knowledge exchange, and international partnerships.',
  ADD COLUMN "heroDescriptionAr" TEXT NOT NULL DEFAULT 'تعمل الجمعية المصرية لطب الأوستيوباثي على نشر الوعي بالأوستيوباثي ودعم تعليمه وممارسته المهنية في مصر والشرق الأوسط، عبر التدريب وتبادل الخبرات والشراكات الدولية.',
  ADD COLUMN "heroPrimaryLabel" TEXT NOT NULL DEFAULT 'About',
  ADD COLUMN "heroPrimaryLabelAr" TEXT NOT NULL DEFAULT 'من نحن',
  ADD COLUMN "heroPrimaryHref" TEXT NOT NULL DEFAULT '/about',
  ADD COLUMN "heroSecondaryLabel" TEXT NOT NULL DEFAULT 'Find an Osteopath',
  ADD COLUMN "heroSecondaryLabelAr" TEXT NOT NULL DEFAULT 'ابحث عن أخصائي أوستيوباثي',
  ADD COLUMN "heroSecondaryHref" TEXT NOT NULL DEFAULT '/find-osteopath';

UPDATE "SiteSettings" SET
  "facebook" = 'https://www.facebook.com/profile.php?id=61595242238581',
  "youtube" = 'https://www.youtube.com/@egsom-media',
  "linkedin" = 'https://www.linkedin.com/in/egyptian-society-osteopathic-medicine-5732a8444/',
  "x" = 'https://x.com/Egsommedia',
  "whatsapp" = '201128811128',
  "email" = CASE WHEN "email" = '' THEN 'support@eg-som.com' ELSE "email" END
WHERE "id" = 'global';

CREATE TABLE "BoardMember" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "positionAr" TEXT NOT NULL,
  "biography" TEXT NOT NULL DEFAULT '',
  "biographyAr" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "linkedin" TEXT NOT NULL DEFAULT '',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "photoData" BYTEA,
  "photoMediaType" TEXT NOT NULL DEFAULT '',
  "photoUpdatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BoardMember_isPublished_sortOrder_idx" ON "BoardMember"("isPublished", "sortOrder");
