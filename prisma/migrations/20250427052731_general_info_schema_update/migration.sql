/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `BiodataPrimaryInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `BiodataPrimaryInfoGuardianContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BiodataPrimaryInfo" DROP COLUMN "phoneNumber",
ADD COLUMN     "mobile" TEXT;

-- AlterTable
ALTER TABLE "BiodataPrimaryInfoGuardianContact" DROP COLUMN "phoneNumber",
ADD COLUMN     "mobile" TEXT;
