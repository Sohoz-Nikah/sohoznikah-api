/*
  Warnings:

  - The `religiousEducation` column on the `BiodataEducationInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `type` on table `BiodataEducationInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `highestDegree` on table `BiodataEducationInfo` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `degreeType` to the `BiodataEducationInfoDegree` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `BiodataEducationInfoDegree` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passYear` on table `BiodataEducationInfoDegree` required. This step will fail if there are existing NULL values in that column.
  - Made the column `group` on table `BiodataEducationInfoDegree` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institute` on table `BiodataEducationInfoDegree` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BiodataEducationInfo" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "highestDegree" SET NOT NULL,
DROP COLUMN "religiousEducation",
ADD COLUMN     "religiousEducation" TEXT[];

-- AlterTable
ALTER TABLE "BiodataEducationInfoDegree" ADD COLUMN     "degreeType" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "passYear" SET NOT NULL,
ALTER COLUMN "group" SET NOT NULL,
ALTER COLUMN "institute" SET NOT NULL;
