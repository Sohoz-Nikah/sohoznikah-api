-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BiodataVerification" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BiodataStatus" AS ENUM ('ACTIVE', 'DELETED_BY_USER', 'DELETED_BY_ADMIN');

-- AlterTable
ALTER TABLE "Biodata" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "status" "BiodataStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "verification" "BiodataVerification" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "visibility" "VisibilityStatus" NOT NULL DEFAULT 'PRIVATE';

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
