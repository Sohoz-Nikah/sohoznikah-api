-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "GenderOption" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('PRESENT', 'PERMANENT');

-- CreateEnum
CREATE TYPE "ReligiousLifestyleType" AS ENUM ('NON_PRACTICING', 'TRYING', 'FULLY_PRACTICING');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'TOKEN_WITHDRAWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT NOT NULL,
    "phoneConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "gender" "GenderOption" NOT NULL,
    "passwordChangedAt" TIMESTAMP(3),
    "refreshToken" TEXT,
    "refreshTokenExpiryTime" TIMESTAMP(3),
    "lockoutEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lockoutEnd" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "failedAccessCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "otp" INTEGER,
    "otpExpiry" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "token" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preApprovalAcceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "preApprovalOathTruthfulInfo" BOOLEAN NOT NULL DEFAULT false,
    "preApprovalOathLegalResponsibility" BOOLEAN NOT NULL DEFAULT false,
    "postApprovalOathTruthfulInfo" BOOLEAN NOT NULL DEFAULT false,
    "postApprovalOathNoMisuse" BOOLEAN NOT NULL DEFAULT false,
    "postApprovalOathLegalResponsibility" BOOLEAN NOT NULL DEFAULT false,
    "profilePic" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Biodata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataPrimaryInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "biodataType" TEXT,
    "biodataFor" TEXT,
    "fullName" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataPrimaryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataGeneralInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "maritalStatus" TEXT,
    "skinTone" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "bloodGroup" TEXT,
    "nationality" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataGeneralInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataNationality" (
    "id" TEXT NOT NULL,
    "biodataGeneralInfoId" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "BiodataNationality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataAddressInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "location" TEXT,
    "state" TEXT,
    "city" TEXT,
    "country" TEXT,
    "cityzenshipStatus" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataAddressInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataEducationInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "type" TEXT,
    "highestDegree" TEXT,
    "religiousEducation" TEXT,
    "detail" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataEducationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataOccupationInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "occupations" TEXT,
    "detail" TEXT,
    "monthlyIncome" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataOccupationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataFamilyInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "parentsAlive" TEXT,
    "fatherOccupation" TEXT,
    "motherOccupation" TEXT,
    "fatherSideDetail" TEXT,
    "motherSideDetail" TEXT,
    "familyType" TEXT,
    "familyBackground" TEXT,
    "livingCondition" TEXT,
    "wealthDescription" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataFamilyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataFamilyInfoSibling" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "type" TEXT,
    "occupation" TEXT,
    "maritalStatus" TEXT,
    "children" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataFamilyInfoSibling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataReligiousInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "religiousLifestyle" "ReligiousLifestyleType" NOT NULL,
    "ideology" TEXT,
    "madhab" TEXT,
    "praysFiveTimes" TEXT,
    "hasQazaPrayers" TEXT,
    "canReciteQuranProperly" TEXT,
    "avoidsHaramIncome" TEXT,
    "modestDressing" TEXT,
    "followsMahramRules" TEXT,
    "beliefAboutPirMurshidAndMazar" TEXT,
    "practicingSince" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataReligiousInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataPersonalInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "beardStatus" TEXT,
    "preferredOutfit" TEXT,
    "entertainmentPreferences" TEXT,
    "healthConditions" TEXT,
    "personalTraits" TEXT,
    "genderEqualityView" TEXT,
    "lgbtqOpinion" TEXT,
    "specialConditions" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataPersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataMarriageInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "guardianApproval" TEXT,
    "continueStudy" TEXT,
    "careerPlan" TEXT,
    "residence" TEXT,
    "arrangeHijab" TEXT,
    "dowryExpectation" TEXT,
    "allowShowingPhotoOnline" TEXT,
    "additionalMarriageInfo" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataMarriageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataSpousePreferenceInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "age" TEXT,
    "skinTone" TEXT,
    "height" TEXT,
    "educationalQualification" TEXT,
    "religiousEducationalQualification" TEXT,
    "address" TEXT,
    "maritalStatus" TEXT,
    "specialCategory" TEXT,
    "religiousType" TEXT,
    "occupation" TEXT,
    "familyBackground" TEXT,
    "secondMarrige" TEXT,
    "location" TEXT,
    "qualities" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataSpousePreferenceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataEducationInfoDegree" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "name" TEXT,
    "passYear" TEXT,
    "group" TEXT,
    "institute" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataEducationInfoDegree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataPrimaryInfoGuardianContact" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "relation" TEXT,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataPrimaryInfoGuardianContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavouriteBiodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavouriteBiodata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortlistBiodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistBiodata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteBiodata_userId_biodataId_key" ON "FavouriteBiodata"("userId", "biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistBiodata_userId_biodataId_key" ON "ShortlistBiodata"("userId", "biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAccess_userId_biodataId_key" ON "ContactAccess"("userId", "biodataId");

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataNationality" ADD CONSTRAINT "BiodataNationality_biodataGeneralInfoId_fkey" FOREIGN KEY ("biodataGeneralInfoId") REFERENCES "BiodataGeneralInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteBiodata" ADD CONSTRAINT "FavouriteBiodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteBiodata" ADD CONSTRAINT "FavouriteBiodata_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistBiodata" ADD CONSTRAINT "ShortlistBiodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistBiodata" ADD CONSTRAINT "ShortlistBiodata_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
