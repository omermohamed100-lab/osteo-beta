-- Additive rollout for revocable admin sessions and shared rate-limit state.
ALTER TABLE "User"
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "RateLimitBucket" (
  "id" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RateLimitBucket_expiresAt_idx"
  ON "RateLimitBucket"("expiresAt");

CREATE INDEX "RateLimitBucket_scope_keyHash_idx"
  ON "RateLimitBucket"("scope", "keyHash");
