-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "facebookUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "instagramUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "footerYear" TEXT NOT NULL DEFAULT '2026';
