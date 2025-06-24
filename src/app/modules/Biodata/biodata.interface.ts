import { BiodataStatus, BioDataType } from '@prisma/client';

export type IBiodataFilterRequest = {
  status?: BiodataStatus | undefined;
  searchTerm?: string | undefined;
  biodataType?: string | undefined;
  ageMin?: number | undefined;
  ageMax?: number | undefined;
  currentState?: string | undefined;
  maritalStatus?: string | undefined;
  skinTone?: string | undefined;
  heightMin?: number | undefined;
  heightMax?: number | undefined;
  occupation?: string | undefined;
  education?: string | undefined;
  religiousEducation?: string | undefined;
  familyStatus?: string | undefined;
  madhhab?: string | undefined;
  bloodGroup?: string | undefined;
  specialCategory?: string | undefined;
  myBiodataType?: string | undefined;
  mySpecialCategory?: string | undefined;
};

// Types for form data
export interface GuardianContact {
  relation: string;
  fullName: string;
  phoneNumber: string;
}

export interface Address {
  type: string;
  location: string;
  state: string;
  city: string;
  country: string;
  cityzenshipStatus: string;
  detail: string;
  permanentHomeAddress: string;
}

export interface Degree {
  degreeType: string;
  name: string;
  passYear: string;
  group: string;
  institute: string;
}

export interface Sibling {
  serial?: string;
  type?: string;
  occupation?: string;
  maritalStatus?: string;
  children?: string;
}

export interface BiodataFormData {
  firstWordsFormData?: {
    preApprovalAcceptTerms: boolean;
    preApprovalOathTruthfulInfo: boolean;
    preApprovalOathLegalResponsibility: boolean;
  };
  primaryInfoFormData?: {
    biodataType: BioDataType;
    biodataFor: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    email: string;
    phoneNumber: string;
    guardianContacts?: GuardianContact[];
  };
  generalInfoFormData?: Record<string, any>;
  addressInfoFormData?: {
    addresses: Address[];
  };
  educationInfoFormData?: {
    type: string;
    highestDegree: string;
    religiousEducation: string[];
    detail: string;
    degrees?: Degree[];
  };
  occupationInfoFormData?: Record<string, any>;
  familyInfoFormData?: {
    parentsAlive: string;
    fatherOccupation: string;
    motherOccupation: string;
    fatherSideDetail: string;
    motherSideDetail: string;
    familyType: string;
    familyBackground: string;
    livingCondition: string;
    wealthDescription: string;
    siblings?: Sibling[];
  };
  religiousInfoFormData?: Record<string, any>;
  personalInfoFormData?: Record<string, any>;
  marriageInfoFormData?: Record<string, any>;
  spousePreferenceInfoFormData?: Record<string, any>;
  profilePicFormData?: {
    photoId: string;
  };
  finalWordsFormData?: {
    postApprovalOathTruthfulInfo: boolean;
    postApprovalOathNoMisuse: boolean;
    postApprovalOathLegalResponsibility: boolean;
    visibility?: string;
  };
}

export interface RangeConfig {
  minKey: string;
  maxKey: string;
  relation: string;
  field: string;
  useIs?: boolean;
}
