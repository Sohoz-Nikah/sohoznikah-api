/*
  Warnings:

  - The `skinTone` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `religiousEducationalQualification` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maritalStatus` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialCategory` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `religiousType` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `occupation` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `familyBackground` column on the `BiodataSpousePreferenceInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `age` on table `BiodataSpousePreferenceInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BiodataSpousePreferenceInfo" ALTER COLUMN "age" SET NOT NULL,
DROP COLUMN "skinTone",
ADD COLUMN     "skinTone" TEXT[],
DROP COLUMN "religiousEducationalQualification",
ADD COLUMN     "religiousEducationalQualification" TEXT[],
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" TEXT[],
DROP COLUMN "specialCategory",
ADD COLUMN     "specialCategory" TEXT[],
DROP COLUMN "religiousType",
ADD COLUMN     "religiousType" TEXT[],
DROP COLUMN "occupation",
ADD COLUMN     "occupation" TEXT[],
DROP COLUMN "familyBackground",
ADD COLUMN     "familyBackground" TEXT[];
