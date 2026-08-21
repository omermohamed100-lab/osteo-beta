-- Practitioner applications remain private review records. Approved new
-- applications may create an inactive, unverified directory draft.
CREATE TABLE "PractitionerApplication" (
    "id" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "specialtyAr" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL,
    "cityAr" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'Egypt',
    "countryAr" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "locationAr" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL,
    "bioAr" TEXT NOT NULL DEFAULT '',
    "profileImage" TEXT,
    "credentialType" TEXT NOT NULL,
    "credentialTypeAr" TEXT NOT NULL DEFAULT '',
    "credentialNumber" TEXT NOT NULL,
    "credentialIssuer" TEXT NOT NULL,
    "credentialIssuerAr" TEXT NOT NULL DEFAULT '',
    "credentialIssuedAt" TIMESTAMP(3),
    "credentialExpiresAt" TIMESTAMP(3),
    "existingProfileUrl" TEXT NOT NULL DEFAULT '',
    "applicantNotes" TEXT NOT NULL DEFAULT '',
    "consentAccuracy" BOOLEAN NOT NULL,
    "consentPrivacy" BOOLEAN NOT NULL,
    "reviewNotes" TEXT NOT NULL DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "draftOsteopathId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PractitionerApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PractitionerApplication_draftOsteopathId_key" ON "PractitionerApplication"("draftOsteopathId");
CREATE INDEX "PractitionerApplication_status_createdAt_idx" ON "PractitionerApplication"("status", "createdAt");
CREATE INDEX "PractitionerApplication_email_createdAt_idx" ON "PractitionerApplication"("email", "createdAt");

ALTER TABLE "PractitionerApplication"
ADD CONSTRAINT "PractitionerApplication_draftOsteopathId_fkey"
FOREIGN KEY ("draftOsteopathId") REFERENCES "Osteopath"("id") ON DELETE SET NULL ON UPDATE CASCADE;
