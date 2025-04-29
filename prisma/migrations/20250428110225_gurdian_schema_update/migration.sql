/*
  Warnings:

  - You are about to drop the column `fullName` on the `BiodataPrimaryInfoGuardianContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BiodataPrimaryInfoGuardianContact" DROP COLUMN "fullName",
ADD COLUMN     "name" TEXT;
