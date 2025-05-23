/*
  Warnings:

  - The `nationality` column on the `BiodataGeneralInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `BiodataNationality` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Biodata` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BiodataNationality" DROP CONSTRAINT "BiodataNationality_biodataGeneralInfoId_fkey";

-- AlterTable
ALTER TABLE "BiodataGeneralInfo" DROP COLUMN "nationality",
ADD COLUMN     "nationality" TEXT[];

-- DropTable
DROP TABLE "BiodataNationality";

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_userId_key" ON "Biodata"("userId");
