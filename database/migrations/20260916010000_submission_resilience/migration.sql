CREATE TABLE "CourseInterestDedupe" (
    "keyHash" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CourseInterestDedupe_pkey" PRIMARY KEY ("keyHash")
);
CREATE TABLE "PractitionerApplicationDedupe" (
    "keyHash" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PractitionerApplicationDedupe_pkey" PRIMARY KEY ("keyHash")
);
CREATE UNIQUE INDEX "CourseInterestDedupe_interestId_key" ON "CourseInterestDedupe"("interestId");
CREATE INDEX "CourseInterestDedupe_expiresAt_idx" ON "CourseInterestDedupe"("expiresAt");
CREATE UNIQUE INDEX "PractitionerApplicationDedupe_applicationId_key" ON "PractitionerApplicationDedupe"("applicationId");
CREATE INDEX "PractitionerApplicationDedupe_expiresAt_idx" ON "PractitionerApplicationDedupe"("expiresAt");
ALTER TABLE "CourseInterestDedupe" ADD CONSTRAINT "CourseInterestDedupe_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "CourseInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PractitionerApplicationDedupe" ADD CONSTRAINT "PractitionerApplicationDedupe_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PractitionerApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "ContactSubmission_createdAt_id_idx" ON "ContactSubmission"("createdAt", "id");
CREATE INDEX "CourseInterest_createdAt_id_idx" ON "CourseInterest"("createdAt", "id");
CREATE INDEX "PractitionerApplication_createdAt_id_idx" ON "PractitionerApplication"("createdAt", "id");
CREATE INDEX "PractitionerApplication_status_createdAt_id_idx" ON "PractitionerApplication"("status", "createdAt", "id");
