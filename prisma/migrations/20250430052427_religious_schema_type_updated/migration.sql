/*
  Warnings:

  - You are about to drop the column `religiousLifestyle` on the `BiodataReligiousInfo` table. All the data in the column will be lost.
  - Added the required column `type` to the `BiodataReligiousInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiodataReligiousInfo" DROP COLUMN "religiousLifestyle",
ADD COLUMN     "type" TEXT NOT NULL;
