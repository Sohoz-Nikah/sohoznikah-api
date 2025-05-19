/*
  Warnings:

  - The primary key for the `BiodataMarriageInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BiodataMarriageInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `guardianApproval` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `careerPlan` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `residence` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dowryExpectation` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `BiodataMarriageInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BiodataAddressInfo" ADD COLUMN     "detail" TEXT,
ADD COLUMN     "permanentHomeAddress" TEXT,
ALTER COLUMN "state" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BiodataEducationInfoDegree" ALTER COLUMN "group" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BiodataMarriageInfo" DROP CONSTRAINT "BiodataMarriageInfo_pkey",
ADD COLUMN     "careerPlanDetails" TEXT,
ADD COLUMN     "childrenDetails" TEXT,
ADD COLUMN     "continueStudyDetails" TEXT,
ADD COLUMN     "currentSpouseAndChildren" TEXT,
ADD COLUMN     "previousMarriageAndDivorceDetails" TEXT,
ADD COLUMN     "reasonForRemarriage" TEXT,
ADD COLUMN     "spouseDeathDetails" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "guardianApproval" SET NOT NULL,
ALTER COLUMN "careerPlan" SET NOT NULL,
ALTER COLUMN "residence" SET NOT NULL,
ALTER COLUMN "dowryExpectation" SET NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "continueStudy" SET NOT NULL,
ALTER COLUMN "continueStudy" SET DATA TYPE TEXT,
ADD CONSTRAINT "BiodataMarriageInfo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BiodataPersonalInfo" ADD COLUMN     "aboutYourself" TEXT;

-- AlterTable
ALTER TABLE "BiodataReligiousInfo" ALTER COLUMN "hasQazaPrayers" DROP NOT NULL,
ALTER COLUMN "avoidsHaramIncome" DROP NOT NULL;
