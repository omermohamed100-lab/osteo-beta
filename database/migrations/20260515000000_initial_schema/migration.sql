-- Idempotent baseline for databases created before migrations were committed.
-- Existing production tables are preserved; a fresh database receives the
-- original schema before the later additive migrations are applied.
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Course" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "instructor" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "price" DOUBLE PRECISION,
  "imageUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContactSubmission" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "id" TEXT NOT NULL DEFAULT 'global',
  "phone" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT 'no-reply@example.com',
  "address" TEXT NOT NULL DEFAULT '',
  "facebook" TEXT NOT NULL DEFAULT '',
  "instagram" TEXT NOT NULL DEFAULT '',
  "linkedin" TEXT NOT NULL DEFAULT '',
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Osteopath" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "specialty" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'Egypt',
  "location" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "bio" TEXT NOT NULL DEFAULT '',
  "profileImage" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Osteopath_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GalleryItem" (
  "id" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "caption" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL DEFAULT 'General',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Activity" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "location" TEXT NOT NULL,
  "imageUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
