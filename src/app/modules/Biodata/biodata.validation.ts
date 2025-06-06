import { z } from 'zod';

export const CreateBiodataSchema = z.object({
  userId: z.string().uuid().optional(),
  preApprovalAcceptTerms: z.boolean().optional(),
  preApprovalOathTruthfulInfo: z.boolean().optional(),
  preApprovalOathLegalResponsibility: z.boolean().optional(),
  postApprovalOathTruthfulInfo: z.boolean().optional(),
  postApprovalOathNoMisuse: z.boolean().optional(),
  postApprovalOathLegalResponsibility: z.boolean().optional(),
  profilePic: z.string().url().optional(),
});

export const BiodataPrimaryInfoSchema = z.object({
  biodataType: z.string().optional(),
  biodataFor: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

export const BiodataGeneralInfoSchema = z.object({
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  skinTone: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.array(z.string()).optional(),
});

export const addressTypeEnum = z.enum(['PRESENT', 'PERMANENT']);

export const biodataAddressInfoSchema = z.object({
  biodataId: z.string().uuid(), // assuming UUID
  type: addressTypeEnum,
  location: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  cityzenshipStatus: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataOccupationInfoSchema = z.object({
  biodataId: z.string().uuid(),
  occupations: z.string().optional().nullable(),
  detail: z.string().optional().nullable(),
  monthlyIncome: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataFamilyInfoSchema = z.object({
  biodataId: z.string().uuid(),
  parentsAlive: z.string().optional().nullable(),
  fatherOccupation: z.string().optional().nullable(),
  motherOccupation: z.string().optional().nullable(),
  fatherSideDetail: z.string().optional().nullable(),
  motherSideDetail: z.string().optional().nullable(),
  familyType: z.string().optional().nullable(),
  familyBackground: z.string().optional().nullable(),
  livingCondition: z.string().optional().nullable(),
  wealthDescription: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataFamilyInfoSiblingSchema = z.object({
  biodataId: z.string().uuid(),
  type: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  children: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataReligiousInfoSchema = z.object({
  biodataId: z.string().uuid(),
  religiousLifestyle: z.enum(['NON_PRACTICING', 'TRYING', 'FULLY_PRACTICING']),
  ideology: z.string().optional().nullable(),
  madhab: z.string().optional().nullable(),
  praysFiveTimes: z.string().optional().nullable(),
  hasQazaPrayers: z.string().optional().nullable(),
  canReciteQuranProperly: z.string().optional().nullable(),
  avoidsHaramIncome: z.string().optional().nullable(),
  modestDressing: z.string().optional().nullable(),
  followsMahramRules: z.string().optional().nullable(),
  beliefAboutPirMurshidAndMazar: z.string().optional().nullable(),
  practicingSince: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataPersonalInfoSchema = z.object({
  biodataId: z.string().uuid(),
  beardStatus: z.string().optional().nullable(),
  preferredOutfit: z.string().optional().nullable(),
  entertainmentPreferences: z.string().optional().nullable(),
  healthConditions: z.string().optional().nullable(),
  personalTraits: z.string().optional().nullable(),
  genderEqualityView: z.string().optional().nullable(),
  lgbtqOpinion: z.string().optional().nullable(),
  specialConditions: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataMarriageInfoSchema = z.object({
  biodataId: z.string().uuid(),
  guardianApproval: z.string().optional().nullable(),
  continueStudy: z.string().optional().nullable(),
  careerPlan: z.string().optional().nullable(),
  residence: z.string().optional().nullable(),
  arrangeHijab: z.string().optional().nullable(),
  dowryExpectation: z.string().optional().nullable(),
  allowShowingPhotoOnline: z.string().optional().nullable(),
  additionalMarriageInfo: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataSpousePreferenceInfoSchema = z.object({
  biodataId: z.string().uuid(),
  age: z.string().optional().nullable(),
  skinTone: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  educationalQualification: z.string().optional().nullable(),
  religiousEducationalQualification: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  specialCategory: z.string().optional().nullable(),
  religiousType: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  familyBackground: z.string().optional().nullable(),
  secondMarrige: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  qualities: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataEducationInfoDegreeSchema = z.object({
  biodataId: z.string().uuid(),
  name: z.string().optional().nullable(),
  passYear: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  institute: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const biodataPrimaryInfoGuardianContactSchema = z.object({
  biodataId: z.string().uuid(),
  relation: z.string().optional().nullable(),
  fullName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const FullBiodataSchema = CreateBiodataSchema.extend({
  primaryInfos: z.array(BiodataPrimaryInfoSchema).optional(),
  generalInfos: z.array(BiodataGeneralInfoSchema).optional(),
  addressInfos: z.array(biodataAddressInfoSchema).optional(),
  educationInfos: z.array(biodataEducationInfoDegreeSchema).optional(),
  occupationInfos: z.array(biodataOccupationInfoSchema).optional(),
  familyInfos: z.array(biodataFamilyInfoSchema).optional(),
  familySiblings: z.array(biodataFamilyInfoSiblingSchema).optional(),
  religiousInfos: z.array(biodataReligiousInfoSchema).optional(),
  personalInfos: z.array(biodataPersonalInfoSchema).optional(),
  marriageInfos: z.array(biodataMarriageInfoSchema).optional(),
  spousePreferenceInfos: z.array(biodataSpousePreferenceInfoSchema).optional(),
  primaryInfoGuardianContacts: z
    .array(biodataPrimaryInfoGuardianContactSchema)
    .optional(),
});

export const updateBiodataVisibilityValidationSchema = z.object({
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  status: z
    .enum([
      'PENDING',
      'APPROVED',
      'REJECTED',
      'UPDATE_REQUESTED',
      'DELETE_REQUESTED',
      'DELETED',
    ])
    .optional(),
});

export const createBiodataValidationSchema = z.object({
  ...FullBiodataSchema.shape,
});
export const updateBiodataValidationSchema = z.object({
  ...FullBiodataSchema.shape,
});
