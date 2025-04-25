-- DropForeignKey
ALTER TABLE "Biodata" DROP CONSTRAINT "Biodata_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Biodata" DROP CONSTRAINT "Biodata_updatedBy_fkey";

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
