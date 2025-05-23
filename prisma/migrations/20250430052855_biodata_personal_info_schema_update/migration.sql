/*
  Warnings:

  - The `personalTraits` column on the `BiodataPersonalInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialConditions` column on the `BiodataPersonalInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BiodataPersonalInfo" DROP COLUMN "personalTraits",
ADD COLUMN     "personalTraits" TEXT[],
DROP COLUMN "specialConditions",
ADD COLUMN     "specialConditions" TEXT[];

-- AlterTable
ALTER TABLE "BiodataReligiousInfo" ALTER COLUMN "modestDressing" DROP NOT NULL,
ALTER COLUMN "followsMahramRules" DROP NOT NULL,
ALTER COLUMN "beliefAboutPirMurshidAndMazar" DROP NOT NULL,
ALTER COLUMN "practicingSince" DROP NOT NULL;

-- DropEnum
DROP TYPE "ReligiousLifestyleType";
