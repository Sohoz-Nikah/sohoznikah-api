-- DropIndex
DROP INDEX "BiodataAddressInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataEducationInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataEducationInfoDegree_biodataId_key";

-- DropIndex
DROP INDEX "BiodataFamilyInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataFamilyInfoSibling_biodataId_key";

-- DropIndex
DROP INDEX "BiodataGeneralInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataMarriageInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataOccupationInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataPersonalInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataPrimaryInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataPrimaryInfoGuardianContact_biodataId_key";

-- DropIndex
DROP INDEX "BiodataReligiousInfo_biodataId_key";

-- DropIndex
DROP INDEX "BiodataSpousePreferenceInfo_biodataId_key";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "proposalId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
