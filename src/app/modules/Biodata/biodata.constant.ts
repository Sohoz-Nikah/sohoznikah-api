// src/app/modules/Biodata/biodata.constant.ts
import { RelationMap } from '../../utils/buildFilterConditions';
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
  'permanentLocation',
  'permanentState',
  'permanentCity',
  'currentLocation',
  'currentState',
  'currentCity',
  'education',
  'religiousEducation',
  'religiousLifestyle',
  'occupation',
  'familyStatus',
  'madhab',
  'bloodGroup',
  'specialCategory',
  'myBiodataType',
  'mySpecialCategory',
  'myMaritalStatus',
  'myAgeMin',
  'myAgeMax',
  'myHeightMin',
  'myHeightMax',
  'mySkinTone',
];

export const relationFieldMap: RelationMap = {
  // Primary Info (biodataType)
  biodataType: [
    { relation: 'primaryInfoFormData', field: 'biodataType', isArray: false },
  ],

  // General Info
  maritalStatus: [
    { relation: 'generalInfoFormData', field: 'maritalStatus', isArray: false },
  ],
  skinTone: [
    { relation: 'generalInfoFormData', field: 'skinTone', isArray: false },
  ],
  bloodGroup: [
    { relation: 'generalInfoFormData', field: 'bloodGroup', isArray: false },
  ],

  // Address Info - permanent
  permanentLocation: [
    {
      relation: 'addressInfoFormData',
      field: 'location',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'permanent_address',
    },
  ],
  permanentState: [
    {
      relation: 'addressInfoFormData',
      field: 'state',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'permanent_address',
    },
  ],
  permanentCity: [
    {
      relation: 'addressInfoFormData',
      field: 'city',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'permanent_address',
    },
  ],

  // Current address if needed (same structure)
  currentLocation: [
    {
      relation: 'addressInfoFormData',
      field: 'location',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'current_address',
    },
  ],
  currentState: [
    {
      relation: 'addressInfoFormData',
      field: 'state',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'current_address',
    },
  ],
  currentCity: [
    {
      relation: 'addressInfoFormData',
      field: 'city',
      isArray: false,
      transform: v => v,
    },
    {
      relation: 'addressInfoFormData',
      field: 'type',
      isArray: false,
      transform: () => 'current_address',
    },
  ],

  // Education Info
  education: [
    {
      relation: 'educationInfoFormData',
      field: 'type',
      isArray: true,
    },
    {
      relation: 'educationInfoFormData.educationDegrees',
      field: 'degreeType',
      isArray: false,
    },
  ],
  religiousEducation: [
    {
      relation: 'educationInfoFormData',
      field: 'religiousEducation',
      isArray: true,
    },
  ],
  madhab: [
    { relation: 'religiousInfoFormData', field: 'madhab', isArray: false },
  ],

  // Occupation Info
  occupation: [
    { relation: 'occupationInfoFormData', field: 'occupations', isArray: true },
  ],

  // Family Info
  familyStatus: [
    {
      relation: 'familyInfoFormData',
      field: 'familyBackground',
      isArray: false,
    },
  ],

  // Religious Info
  religiousLifestyle: [
    { relation: 'religiousInfoFormData', field: 'madhab', isArray: false },
  ],

  /* ============================ SPECIAL CATEGORY ============================ */

  specialCategory: [
    {
      relation: 'addressInfoFormData',
      field: 'citizenshipStatus',
      isArray: false,
      transform: (val: string) => {
        // map certain keys to actual stored statuses
        const map: Record<string, string> = {
          expatriate: 'expatriate',
          foreign_citizen: 'yes',
        };
        return map[val] || '';
      },
    },
    {
      relation: 'personalInfoFormData',
      field: 'specialConditions',
      isArray: true,
      transform: (val: string) => val,
    },
    {
      relation: 'spousePreferenceInfoFormData',
      field: 'specialCategory',
      isArray: true,
      transform: (val: string) => val,
    },
  ],

  /* ============================ MY FILTERS ==================================== */

  // Spouse Preferences (partner filters)
  myBiodataType: [
    {
      relation: 'primaryInfoFormData',
      field: 'biodataType',
      isArray: false,
      transform: (value: string) => (value === 'GROOM' ? 'BRIDE' : 'GROOM'),
    },
  ],

  mySpecialCategory: [
    {
      relation: 'addressInfoFormData',
      field: 'citizenshipStatus',
      isArray: false,
    },
  ],
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
