CREATE TABLE "biodataAddressInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"type" varchar,
	"location" varchar,
	"state" varchar,
	"city" varchar,
	"detail" varchar,
	"country" varchar,
	"cityzenshipStatus" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataEducationInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"type" varchar,
	"highestDegree" varchar,
	"religiousEducation" varchar,
	"detail" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataEducationInfosDegrees" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"name" varchar,
	"passYear" varchar,
	"group" varchar,
	"institute" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataFamilyInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"parentsAlive" varchar,
	"fatherOccupation" varchar,
	"motherOccupation" varchar,
	"fatherSideDetail" varchar,
	"motherSideDetail" varchar,
	"familyType" varchar,
	"familyBackground" varchar,
	"livingCondition" varchar,
	"wealthDescription" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataFamilyInfoSiblings" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"type" varchar,
	"occupation" varchar,
	"maritalStatus" varchar,
	"children" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataGeneralInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"dateOfBirth" varchar,
	"maritalStatus" varchar,
	"skinTone" varchar,
	"height" varchar,
	"weight" varchar,
	"bloodGroup" varchar,
	"nationality" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataMarriageInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"guardianApproval" varchar,
	"continueStudy" varchar,
	"careerPlan" varchar,
	"residence" varchar,
	"arrangeHijab" varchar,
	"dowryExpectation" varchar,
	"allowShowingPhotoOnline" varchar,
	"additionalMarriageInfo" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataOccupationInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"occupations" varchar,
	"detail" varchar,
	"monthlyIncome" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataPersonalInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"beardStatus" varchar,
	"preferredOutfit" varchar,
	"entertainmentPreferences" varchar,
	"healthConditions" varchar,
	"personalTraits" varchar,
	"genderEqualityView" varchar,
	"lgbtqOpinion" varchar,
	"specialConditions" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataPrimaryInfoGuardianContacts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"relation" varchar,
	"fullName" varchar,
	"phoneNumber" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataPrimaryInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"biodataType" varchar,
	"biodataFor" varchar,
	"fullName" varchar,
	"fatherName" varchar,
	"motherName" varchar,
	"email" varchar,
	"phoneNumber" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataReligiousInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"type" varchar,
	"ideology" varchar,
	"madhab" varchar,
	"praysFiveTimes" varchar,
	"hasQazaPrayers" varchar,
	"canReciteQuranProperly" varchar,
	"avoidsHaramIncome" varchar,
	"modestDressing" varchar,
	"followsMahramRules" varchar,
	"beliefAboutPirMurshidAndMazar" varchar,
	"practicingSince" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodatas" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"userId" varchar(36) NOT NULL,
	"preApprovalAcceptTerms" boolean DEFAULT false,
	"preApprovalOathTruthfulInfo" boolean DEFAULT false,
	"preApprovalOathLegalResponsibility" boolean DEFAULT false,
	"postApprovalOathTruthfulInfo" boolean DEFAULT false,
	"postApprovalOathNoMisuse" boolean DEFAULT false,
	"postApprovalOathLegalResponsibility" boolean DEFAULT false,
	"profilePic" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "biodataSpousePreferenceInfos" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"biodataId" varchar(36) NOT NULL,
	"age" varchar,
	"skinTone" varchar,
	"height" varchar,
	"educationalQualification" varchar,
	"religiousEducationalQualification" varchar,
	"address" varchar,
	"maritalStatus" varchar,
	"specialCategory" varchar,
	"religiousType" varchar,
	"occupation" varchar,
	"familyBackground" varchar,
	"secondMarrige" varchar,
	"location" varchar,
	"qualities" varchar,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"emailConfirmed" boolean DEFAULT false,
	"phoneNumber" text NOT NULL,
	"phoneConfirmed" boolean DEFAULT false,
	"passwordHash" varchar NOT NULL,
	"refreshToken" varchar(36),
	"refreshTokenExpiryTime" timestamp,
	"lockoutEnabled" boolean DEFAULT false,
	"lockoutEnd" timestamp DEFAULT now(),
	"failedAccessCount" integer DEFAULT 0,
	"createdBy" varchar(36),
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar(36),
	"updatedAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
ALTER TABLE "biodataAddressInfos" ADD CONSTRAINT "biodataAddressInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataEducationInfos" ADD CONSTRAINT "biodataEducationInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataEducationInfosDegrees" ADD CONSTRAINT "biodataEducationInfosDegrees_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataFamilyInfos" ADD CONSTRAINT "biodataFamilyInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataFamilyInfoSiblings" ADD CONSTRAINT "biodataFamilyInfoSiblings_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataGeneralInfos" ADD CONSTRAINT "biodataGeneralInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataMarriageInfos" ADD CONSTRAINT "biodataMarriageInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataOccupationInfos" ADD CONSTRAINT "biodataOccupationInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataPersonalInfos" ADD CONSTRAINT "biodataPersonalInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataPrimaryInfoGuardianContacts" ADD CONSTRAINT "biodataPrimaryInfoGuardianContacts_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataPrimaryInfos" ADD CONSTRAINT "biodataPrimaryInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataReligiousInfos" ADD CONSTRAINT "biodataReligiousInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodatas" ADD CONSTRAINT "biodatas_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodataSpousePreferenceInfos" ADD CONSTRAINT "biodataSpousePreferenceInfos_biodataId_biodatas_id_fk" FOREIGN KEY ("biodataId") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;