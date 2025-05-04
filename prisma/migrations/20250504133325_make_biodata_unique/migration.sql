/*
  Warnings:

  - A unique constraint covering the columns `[biodataId]` on the table `BiodataAddressInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataEducationInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataEducationInfoDegree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataFamilyInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataFamilyInfoSibling` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataGeneralInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataMarriageInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataOccupationInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataPersonalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataPrimaryInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataPrimaryInfoGuardianContact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataReligiousInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biodataId]` on the table `BiodataSpousePreferenceInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BiodataAddressInfo_biodataId_key" ON "BiodataAddressInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataEducationInfo_biodataId_key" ON "BiodataEducationInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataEducationInfoDegree_biodataId_key" ON "BiodataEducationInfoDegree"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataFamilyInfo_biodataId_key" ON "BiodataFamilyInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataFamilyInfoSibling_biodataId_key" ON "BiodataFamilyInfoSibling"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataGeneralInfo_biodataId_key" ON "BiodataGeneralInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataMarriageInfo_biodataId_key" ON "BiodataMarriageInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataOccupationInfo_biodataId_key" ON "BiodataOccupationInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataPersonalInfo_biodataId_key" ON "BiodataPersonalInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataPrimaryInfo_biodataId_key" ON "BiodataPrimaryInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataPrimaryInfoGuardianContact_biodataId_key" ON "BiodataPrimaryInfoGuardianContact"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataReligiousInfo_biodataId_key" ON "BiodataReligiousInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataSpousePreferenceInfo_biodataId_key" ON "BiodataSpousePreferenceInfo"("biodataId");
