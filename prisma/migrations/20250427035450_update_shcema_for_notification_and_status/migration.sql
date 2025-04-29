/*
  Warnings:

  - The values [ACTIVE,DELETED_BY_USER,DELETED_BY_ADMIN] on the enum `BiodataStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `verification` on the `Biodata` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BiodataChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "BiodataStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'UPDATE_REQUESTED', 'DELETE_REQUESTED');
ALTER TABLE "Biodata" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Biodata" ALTER COLUMN "status" TYPE "BiodataStatus_new" USING ("status"::text::"BiodataStatus_new");
ALTER TYPE "BiodataStatus" RENAME TO "BiodataStatus_old";
ALTER TYPE "BiodataStatus_new" RENAME TO "BiodataStatus";
DROP TYPE "BiodataStatus_old";
ALTER TABLE "Biodata" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "ContactAccess" DROP CONSTRAINT "ContactAccess_biodataId_fkey";

-- DropForeignKey
ALTER TABLE "ContactAccess" DROP CONSTRAINT "ContactAccess_userId_fkey";

-- AlterTable
ALTER TABLE "Biodata" DROP COLUMN "verification",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "BiodataChangeLog" ADD COLUMN     "status" "BiodataChangeStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "BiodataVerification";

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
