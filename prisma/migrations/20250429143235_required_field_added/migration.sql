/*
  Warnings:

  - The `continueStudy` column on the `BiodataMarriageInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `location` on table `BiodataAddressInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `BiodataAddressInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `BiodataAddressInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `BiodataAddressInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parentsAlive` on table `BiodataFamilyInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maritalStatus` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `skinTone` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bloodGroup` on table `BiodataGeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupations` on table `BiodataOccupationInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `detail` on table `BiodataOccupationInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `beardStatus` on table `BiodataPersonalInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferredOutfit` on table `BiodataPersonalInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entertainmentPreferences` on table `BiodataPersonalInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `healthConditions` on table `BiodataPersonalInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `personalTraits` on table `BiodataPersonalInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `biodataType` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `biodataFor` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fullName` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fatherName` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motherName` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile` on table `BiodataPrimaryInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ideology` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `madhab` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `praysFiveTimes` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasQazaPrayers` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canReciteQuranProperly` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avoidsHaramIncome` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modestDressing` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followsMahramRules` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `beliefAboutPirMurshidAndMazar` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practicingSince` on table `BiodataReligiousInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BiodataAddressInfo" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataFamilyInfo" ALTER COLUMN "parentsAlive" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataGeneralInfo" ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "maritalStatus" SET NOT NULL,
ALTER COLUMN "skinTone" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "bloodGroup" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataMarriageInfo" DROP COLUMN "continueStudy",
ADD COLUMN     "continueStudy" TEXT[];

-- AlterTable
ALTER TABLE "BiodataOccupationInfo" ALTER COLUMN "occupations" SET NOT NULL,
ALTER COLUMN "detail" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataPersonalInfo" ALTER COLUMN "beardStatus" SET NOT NULL,
ALTER COLUMN "preferredOutfit" SET NOT NULL,
ALTER COLUMN "entertainmentPreferences" SET NOT NULL,
ALTER COLUMN "healthConditions" SET NOT NULL,
ALTER COLUMN "personalTraits" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataPrimaryInfo" ALTER COLUMN "biodataType" SET NOT NULL,
ALTER COLUMN "biodataFor" SET NOT NULL,
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "fatherName" SET NOT NULL,
ALTER COLUMN "motherName" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "mobile" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiodataReligiousInfo" ALTER COLUMN "ideology" SET NOT NULL,
ALTER COLUMN "madhab" SET NOT NULL,
ALTER COLUMN "praysFiveTimes" SET NOT NULL,
ALTER COLUMN "hasQazaPrayers" SET NOT NULL,
ALTER COLUMN "canReciteQuranProperly" SET NOT NULL,
ALTER COLUMN "avoidsHaramIncome" SET NOT NULL,
ALTER COLUMN "modestDressing" SET NOT NULL,
ALTER COLUMN "followsMahramRules" SET NOT NULL,
ALTER COLUMN "beliefAboutPirMurshidAndMazar" SET NOT NULL,
ALTER COLUMN "practicingSince" SET NOT NULL;
