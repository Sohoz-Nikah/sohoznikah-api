// src/app/modules/Biodata/biodata.constant.ts

import { RangeConfig } from './biodata.interface';

export const BiodataSearchAbleFields: string[] = ['code'];

export const BiodataFilterableFields: string[] = [
  'searchTerm',
  'biodataType',
  'maritalStatus',
  'ageMin',
  'ageMax',
  'heightMin',
  'heightMax',
  'skinTone',
  'currentState',
  'permanentState',
  'permanentDistrict',
  'currentDistrict',
  'religiousLifestyle',
  'occupation',
  'education',
  'religiousEducation',
  'familyStatus',
  'madhhab',
  'bloodGroup',
  'specialCategory',
  'partnerBiodataType',
  'partnerMaritalStatus',
  'partnerAgeMin',
  'partnerAgeMax',
  'partnerHeightMin',
  'partnerHeightMax',
  'partnerSkinTone',
];

export const relationFieldMap: Record<
  string,
  { relation: string; field: string; isArray: boolean }
> = {
  // Primary Info (biodataType)
  biodataType: {
    relation: 'primaryInfoFormData',
    field: 'biodataType',
    isArray: false,
  },

  // General Info
  maritalStatus: {
    relation: 'generalInfoFormData',
    field: 'maritalStatus',
    isArray: false,
  },
  skinTone: {
    relation: 'generalInfoFormData',
    field: 'skinTone',
    isArray: false,
  },
  bloodGroup: {
    relation: 'generalInfoFormData',
    field: 'bloodGroup',
    isArray: false,
  },
  currentState: {
    relation: 'addressInfoFormData',
    field: 'state',
    isArray: true,
  },
  permanentState: {
    relation: 'addressInfoFormData',
    field: 'permanentState',
    isArray: true,
  },
  permanentDistrict: {
    relation: 'addressInfoFormData',
    field: 'permanentDistrict',
    isArray: true,
  },
  currentDistrict: {
    relation: 'addressInfoFormData',
    field: 'currentDistrict',
    isArray: true,
  },
  currentCity: {
    relation: 'addressInfoFormData',
    field: 'currentCity',
    isArray: true,
  },
  permanentCity: {
    relation: 'addressInfoFormData',
    field: 'permanentCity',
    isArray: true,
  },
  curentLocation: {
    relation: 'addressInfoFormData',
    field: 'currentLocation',
    isArray: false,
  },
  permanentLocation: {
    relation: 'addressInfoFormData',
    field: 'permanentLocation',
    isArray: false,
  },

  // Education Info
  madhhab: {
    relation: 'religiousInfoFormData',
    field: 'madhhab',
    isArray: false,
  },
  education: {
    relation: 'educationDegrees',
    field: 'degreeType',
    isArray: false,
  },
  religiousEducation: {
    relation: 'educationInfoFormData',
    field: 'religiousEducation',
    isArray: true,
  },

  // Occupation Info
  occupation: {
    relation: 'occupationInfoFormData',
    field: 'occupations',
    isArray: true,
  },

  // Family Info
  familyStatus: {
    relation: 'familyInfoFormData',
    field: 'familyBackground',
    isArray: false,
  },

  // Religious Info
  religiousLifestyle: {
    relation: 'religiousInfoFormData',
    field: 'type',
    isArray: false,
  },

  // Spouse Preferences (partner filters)
  partnerBiodataType: {
    relation: 'spousePreferenceInfoFormData',
    field: 'age',
    isArray: false,
  },
  partnerMaritalStatus: {
    relation: 'spousePreferenceInfoFormData',
    field: 'maritalStatus',
    isArray: true,
  },
  specialCategory: {
    relation: 'spousePreferenceInfoFormData',
    field: 'specialCategory',
    isArray: true,
  },
};

export const rangeConfigs: RangeConfig[] = [
  {
    minKey: 'ageMin',
    maxKey: 'ageMax',
    relation: 'generalInfoFormData',
    field: 'dateOfBirth',
  },
  {
    minKey: 'heightMin',
    maxKey: 'heightMax',
    relation: 'generalInfoFormData',
    field: 'height',
  },
  {
    minKey: 'partnerAgeMin',
    maxKey: 'partnerAgeMax',
    relation: 'spousePreferenceInfoFormData',
    field: 'partnerAge',
  },
  {
    minKey: 'partnerHeightMin',
    maxKey: 'partnerHeightMax',
    relation: 'spousePreferenceInfoFormData',
    field: 'partnerHeight',
  },
];
