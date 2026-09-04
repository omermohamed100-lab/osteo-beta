ALTER TABLE "PractitionerApplication"
ADD COLUMN "primaryLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN "photoData" BYTEA,
ADD COLUMN "photoMediaType" TEXT NOT NULL DEFAULT '',
ADD COLUMN "photoOriginalName" TEXT NOT NULL DEFAULT '';
