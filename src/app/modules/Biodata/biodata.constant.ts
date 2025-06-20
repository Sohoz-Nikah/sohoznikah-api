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
      transform: (val: string) => {
        const known = ['alia', 'qawmi'];
        return known.includes(val) ? val : '';
      },
    },
    {
      relation: 'educationDegrees',
      field: 'degreeType',
      isArray: false,
      transform: (val: string) => {
        const known = [
          'below_secondary',
          'secondary',
          'higher_secondary',
          'diploma',
          'bachelor',
          'master',
          'doctoral',
          'medical',
          'defense',
          'police_law_enforcement',
          'aviation',
          'other',
        ];
        return known.includes(val) ? val : '';
      },
    },
  ],
  religiousEducation: [
    {
      relation: 'educationInfoFormData',
      field: 'religiousEducation',
      isArray: true,
    },
  ],

  // Religious Info
  religiousLifestyle: [
    { relation: 'religiousInfoFormData', field: 'type', isArray: false },
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

  /* ============================ SPECIAL CATEGORY ============================ */

  specialCategory: [
    // addressInfoFormData.cityzenshipStatus (1:M) ✅ keep using `some`
    {
      relation: 'generalInfoFormData',
      field: 'nationality',
      isArray: true, // multiple addresses → use `some`
      transform: (val: string) => {
        const known = ['foreign_citizen'];
        return known.includes(val) ? val : '';
      },
    },

    // maritalInfoFormData.continueStudy (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'continueStudy',
      isArray: false, // 1:1 → use `is`, but flag this in your logic
      transform: (val: string) => (val === 'continueStudy' ? 'yes' : ''),
    },

    // maritalInfoFormData.careerPlan (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'careerPlan',
      isArray: false,
      transform: (val: string) => (val === 'careerPlan' ? 'yes' : ''),
    },
    // personalInfoFormData.specialConditions (String[])
    {
      relation: 'personalInfoFormData',
      field: 'specialConditions',
      isArray: true,
      transform: (val: string) => {
        const known = [
          'expatriate',
          'bcs_cadre',
          'social_worker',
          'tabligh_member',
          'religious_service',
          'new_muslim',
          'disabled',
          'orphan',
          'infertility_issues',
          'short_divorced',
          'single_father',
          'short_height',
          'older_age',
          'urban_resident',
          'rural_resident',
        ];
        return known.includes(val) ? val : '';
      },
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
    // maritalInfoFormData.continueStudy (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'continueStudy',
      isArray: false, // 1:1 → use `is`, but flag this in your logic
      transform: (val: string) => (val === 'continueStudy' ? 'yes' : ''),
    },

    // maritalInfoFormData.careerPlan (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'careerPlan',
      isArray: false,
      transform: (val: string) => (val === 'careerPlan' ? 'yes' : ''),
    },
    // spousePreferenceInfoFormData.specialCategory (String[])
    {
      relation: 'spousePreferenceInfoFormData',
      field: 'blackSkinInterest',
      isArray: false,
      transform: (val: string) =>
        val === 'blackSkinInterest' ? 'interested' : '',
    },
    {
      relation: 'spousePreferenceInfoFormData',
      field: 'specialCategory',
      isArray: true,
      transform: (val: string) => {
        const known = [
          'expatriate',
          'foreign_citizen',
          'bcs_cadre',
          'social_worker',
          'tabligh_member',
          'religious_service',
          'new_muslim',
          'disabled',
          'orphan',
          'employed',
          'infertility_issues',
          'short_divorced',
          'single_father',
          'short_height',
          'older_age',
          'urban_resident',
          'rural_resident',
        ];
        return known.includes(val) ? val : '';
      },
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
