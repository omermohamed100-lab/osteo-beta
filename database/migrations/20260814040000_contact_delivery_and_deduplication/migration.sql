-- Additive contact delivery state and short-lived duplicate reservations.
ALTER TABLE "ContactSubmission"
  ADD COLUMN "notificationStatus" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN "notificationAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "notificationLastAttemptedAt" TIMESTAMP(3),
  ADD COLUMN "notificationSentAt" TIMESTAMP(3);

ALTER TABLE "SiteSettings"
  ALTER COLUMN "email" SET DEFAULT '';

CREATE TABLE "ContactSubmissionDedupe" (
  "keyHash" TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ContactSubmissionDedupe_pkey" PRIMARY KEY ("keyHash")
);

CREATE UNIQUE INDEX "ContactSubmissionDedupe_submissionId_key"
  ON "ContactSubmissionDedupe"("submissionId");

CREATE INDEX "ContactSubmissionDedupe_expiresAt_idx"
  ON "ContactSubmissionDedupe"("expiresAt");

ALTER TABLE "ContactSubmissionDedupe"
  ADD CONSTRAINT "ContactSubmissionDedupe_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "ContactSubmission"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
