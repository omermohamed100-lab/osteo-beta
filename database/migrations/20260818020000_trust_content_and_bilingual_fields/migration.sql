-- Additive bilingual content, practitioner credential evidence, and sourced statistics.
ALTER TABLE "Course"
  ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "descriptionAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "instructorAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "durationAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "priceCurrency" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Activity"
  ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "descriptionAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "locationAr" TEXT NOT NULL DEFAULT '';

ALTER TABLE "GalleryItem"
  ADD COLUMN "captionAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "categoryAr" TEXT NOT NULL DEFAULT '';

ALTER TABLE "SiteSettings"
  ADD COLUMN "addressAr" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Osteopath"
  ADD COLUMN "specialtyAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "locationAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "bioAr" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialType" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialIssuer" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "credentialStatus" TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN "credentialVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "credentialExpiresAt" TIMESTAMP(3),
  ADD COLUMN "profileReviewedAt" TIMESTAMP(3);

CREATE TABLE "PublicStatistic" (
  "id" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "labelAr" TEXT NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "lastVerifiedAt" TIMESTAMP(3) NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PublicStatistic_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PublicStatistic_isPublished_sortOrder_idx"
  ON "PublicStatistic"("isPublished", "sortOrder");
