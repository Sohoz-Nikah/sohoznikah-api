-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BioDataType" AS ENUM ('GROOM', 'BRIDE');

-- CreateEnum
CREATE TYPE "BiodataStatus" AS ENUM ('PROCESSING', 'PENDING', 'APPROVED', 'REJECTED', 'UPDATE_REQUESTED', 'DELETE_REQUESTED', 'DELETED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'NEED_TIME', 'TOKEN_WITHDRAWN');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('CUSTOM', 'BUNDLE1', 'BUNDLE2', 'BUNDLE3');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BiodataChangeType" AS ENUM ('UPDATE', 'DELETE', 'ADDITION');

-- CreateEnum
CREATE TYPE "BiodataChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordChangedAt" TIMESTAMP(3),
    "accountType" TEXT,
    "refreshToken" TEXT,
    "refreshTokenExpiryTime" TIMESTAMP(3),
    "lockoutEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lockoutEnd" TIMESTAMP(3),
    "failedAccessCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "bioDeleteReason" TEXT,
    "bkashNumber" TEXT,
    "spouseBiodata" TEXT,
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
    "code" TEXT,
    "biodataType" "BioDataType",
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
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "BiodataStatus" NOT NULL DEFAULT 'PROCESSING',
    "visibility" "VisibilityStatus" NOT NULL DEFAULT 'PRIVATE',
    "biodataCompleted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Biodata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataPrimaryInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "biodataType" "BioDataType" NOT NULL,
    "biodataFor" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
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
    "dateOfBirth" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "nationality" TEXT[],
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataGeneralInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataAddressInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "detail" TEXT,
    "permanentHomeAddress" TEXT,
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
    "type" TEXT NOT NULL,
    "highestDegree" TEXT NOT NULL,
    "religiousEducation" TEXT[],
    "detail" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataEducationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataEducationInfoDegree" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "degreeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passYear" TEXT NOT NULL,
    "group" TEXT,
    "institute" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataEducationInfoDegree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataOccupationInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "occupations" TEXT[],
    "detail" TEXT NOT NULL,
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
    "parentsAlive" TEXT NOT NULL,
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
    "serial" TEXT,
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
    "type" TEXT NOT NULL,
    "ideology" TEXT NOT NULL,
    "madhab" TEXT NOT NULL,
    "praysFiveTimes" TEXT NOT NULL,
    "hasQazaPrayers" TEXT,
    "canReciteQuranProperly" TEXT NOT NULL,
    "avoidsHaramIncome" TEXT,
    "followsMahramRules" TEXT,
    "beliefAboutPirMurshidAndMazar" TEXT,
    "practicingSince" TEXT,
    "modestDressing" TEXT,
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
    "beardStatus" TEXT NOT NULL,
    "preferredOutfit" TEXT NOT NULL,
    "entertainmentPreferences" TEXT NOT NULL,
    "healthConditions" TEXT NOT NULL,
    "personalTraits" TEXT[],
    "genderEqualityView" TEXT,
    "lgbtqOpinion" TEXT,
    "specialConditions" TEXT[],
    "aboutYourself" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BiodataPersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataMarriageInfo" (
    "id" SERIAL NOT NULL,
    "biodataId" TEXT NOT NULL,
    "reasonForRemarriage" TEXT,
    "currentSpouseAndChildren" TEXT,
    "previousMarriageAndDivorceDetails" TEXT,
    "spouseDeathDetails" TEXT,
    "childrenDetails" TEXT,
    "guardianApproval" TEXT NOT NULL,
    "continueStudy" TEXT NOT NULL,
    "continueStudyDetails" TEXT,
    "careerPlan" TEXT NOT NULL,
    "careerPlanDetails" TEXT,
    "residence" TEXT NOT NULL,
    "arrangeHijab" TEXT,
    "dowryExpectation" TEXT NOT NULL,
    "allowShowingPhotoOnline" TEXT,
    "additionalMarriageInfo" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiodataMarriageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataSpousePreferenceInfo" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "skinTone" TEXT[],
    "height" TEXT,
    "educationalQualification" TEXT,
    "religiousEducationalQualification" TEXT[],
    "address" TEXT,
    "maritalStatus" TEXT[],
    "specialCategory" TEXT[],
    "religiousType" TEXT[],
    "occupation" TEXT[],
    "familyBackground" TEXT[],
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
    "isShortlisted" BOOLEAN NOT NULL DEFAULT false,
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
    "tokenSpent" BOOLEAN NOT NULL DEFAULT true,
    "tokenRefunded" BOOLEAN NOT NULL DEFAULT false,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAccess" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "tokenSpent" INTEGER NOT NULL DEFAULT 2,
    "tokenRefunded" BOOLEAN NOT NULL DEFAULT false,
    "contactStatus" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "contactExpiredAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT,
    "proposalId" TEXT,
    "contactAccessId" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "tokenStatus" "TokenStatus" NOT NULL DEFAULT 'REQUESTED',
    "phoneNumber" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataChangeLog" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "changedBy" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeType" "BiodataChangeType",
    "status" "BiodataChangeStatus" NOT NULL DEFAULT 'PENDING',
    "changes" JSONB,

    CONSTRAINT "BiodataChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_code_key" ON "Biodata"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_userId_key" ON "Biodata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataPrimaryInfo_biodataId_key" ON "BiodataPrimaryInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataGeneralInfo_biodataId_key" ON "BiodataGeneralInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataEducationInfo_biodataId_key" ON "BiodataEducationInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataOccupationInfo_biodataId_key" ON "BiodataOccupationInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataFamilyInfo_biodataId_key" ON "BiodataFamilyInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataReligiousInfo_biodataId_key" ON "BiodataReligiousInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataPersonalInfo_biodataId_key" ON "BiodataPersonalInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataMarriageInfo_biodataId_key" ON "BiodataMarriageInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "BiodataSpousePreferenceInfo_biodataId_key" ON "BiodataSpousePreferenceInfo"("biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteBiodata_userId_biodataId_key" ON "FavouriteBiodata"("userId", "biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistBiodata_userId_biodataId_key" ON "ShortlistBiodata"("userId", "biodataId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAccess_senderId_receiverId_biodataId_key" ON "ContactAccess"("senderId", "receiverId", "biodataId");

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfo" ADD CONSTRAINT "BiodataPrimaryInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataGeneralInfo" ADD CONSTRAINT "BiodataGeneralInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataAddressInfo" ADD CONSTRAINT "BiodataAddressInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfo" ADD CONSTRAINT "BiodataEducationInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataEducationInfoDegree" ADD CONSTRAINT "BiodataEducationInfoDegree_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataOccupationInfo" ADD CONSTRAINT "BiodataOccupationInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfo" ADD CONSTRAINT "BiodataFamilyInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataFamilyInfoSibling" ADD CONSTRAINT "BiodataFamilyInfoSibling_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataReligiousInfo" ADD CONSTRAINT "BiodataReligiousInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPersonalInfo" ADD CONSTRAINT "BiodataPersonalInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataMarriageInfo" ADD CONSTRAINT "BiodataMarriageInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataSpousePreferenceInfo" ADD CONSTRAINT "BiodataSpousePreferenceInfo_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataPrimaryInfoGuardianContact" ADD CONSTRAINT "BiodataPrimaryInfoGuardianContact_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_contactAccessId_fkey" FOREIGN KEY ("contactAccessId") REFERENCES "ContactAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiodataChangeLog" ADD CONSTRAINT "BiodataChangeLog_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
