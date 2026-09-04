CREATE TABLE "CourseInterest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT '',
    "consentNotifications" BOOLEAN NOT NULL,
    "notificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "notificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "notificationLastAttemptedAt" TIMESTAMP(3),
    "notificationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseInterest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CourseInterest_createdAt_idx" ON "CourseInterest"("createdAt");
CREATE INDEX "CourseInterest_email_createdAt_idx" ON "CourseInterest"("email", "createdAt");
