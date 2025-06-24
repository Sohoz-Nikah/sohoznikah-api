// src/app/modules/Biodata/biodata.constant.ts
import { RelationMap } from '../../utils/buildFilterConditions';
import { RangeConfig } from './biodata.interface';

export const BiodataSearchAbleFields: string[] = ['code'];

export const BiodataFilterableFields: string[] = [
  'status',
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
    {
      relation: 'primaryInfoFormData',
      field: 'biodataType',
      isArray: false,
      useIs: true,
    },
  ],
  maritalStatus: [
    {
      relation: 'generalInfoFormData',
      field: 'maritalStatus',
      isArray: false,
      useIs: true,
    },
  ],
  skinTone: [
    {
      relation: 'generalInfoFormData',
      field: 'skinTone',
      isArray: false,
      useIs: true,
    },
  ],
  bloodGroup: [
    {
      relation: 'generalInfoFormData',
      field: 'bloodGroup',
      isArray: false,
      useIs: true,
    },
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
      useIs: true,
      transform: (val: string) => {
        const known = ['alia', 'qawmi'];
        return known.includes(val) ? val : '';
      },
    },
    {
      relation: 'educationDegrees',
      field: 'degreeType',
      isArray: false,
      useIs: false,
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
      useIs: true,
    },
  ],

  // Religious Info
  religiousLifestyle: [
    {
      relation: 'religiousInfoFormData',
      field: 'type',
      isArray: false,
      useIs: true,
    },
  ],

  madhab: [
    {
      relation: 'religiousInfoFormData',
      field: 'madhab',
      isArray: false,
      useIs: true,
    },
  ],

  // Occupation Info
  occupation: [
    {
      relation: 'occupationInfoFormData',
      field: 'occupations',
      isArray: true,
      useIs: true,
    },
  ],

  // Family Info
  familyStatus: [
    {
      relation: 'familyInfoFormData',
      field: 'familyBackground',
      isArray: false,
      useIs: true,
    },
  ],

  /* ============================ SPECIAL CATEGORY ============================ */

  specialCategory: [
    // addressInfoFormData.cityzenshipStatus (1:M) ✅ keep using `some`
    {
      relation: 'generalInfoFormData',
      field: 'nationality',
      isArray: true,
      useIs: true,
      transform: (val: string) => {
        const known = ['foreign_citizen'];
        return known.includes(val) ? val : '';
      },
    },

    // maritalInfoFormData.continueStudy (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'continueStudy',
      isArray: false,
      useIs: true,
      transform: (val: string) => (val === 'continueStudy' ? 'yes' : ''),
    },

    // maritalInfoFormData.careerPlan (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'careerPlan',
      isArray: false,
      useIs: true,
      transform: (val: string) => (val === 'careerPlan' ? 'yes' : ''),
    },
    // personalInfoFormData.specialConditions (String[])
    {
      relation: 'personalInfoFormData',
      field: 'specialConditions',
      isArray: true,
      useIs: true,
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
      useIs: true,
      transform: (value: string) => (value === 'GROOM' ? 'BRIDE' : 'GROOM'),
    },
  ],

  mySpecialCategory: [
    // maritalInfoFormData.continueStudy (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'continueStudy',
      isArray: false,
      useIs: true,
      transform: (val: string) => (val === 'continueStudy' ? 'yes' : ''),
    },

    // maritalInfoFormData.careerPlan (1:1) ✅ use `is`
    {
      relation: 'maritalInfoFormData',
      field: 'careerPlan',
      isArray: false,
      useIs: true,
      transform: (val: string) => (val === 'careerPlan' ? 'yes' : ''),
    },
    // spousePreferenceInfoFormData.specialCategory (String[])
    {
      relation: 'spousePreferenceInfoFormData',
      field: 'blackSkinInterest',
      isArray: false,
      useIs: true,
      transform: (val: string) =>
        val === 'blackSkinInterest' ? 'interested' : '',
    },
    {
      relation: 'spousePreferenceInfoFormData',
      field: 'specialCategory',
      isArray: true,
      useIs: true,
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
    useIs: true,
  },
  {
    minKey: 'heightMin',
    maxKey: 'heightMax',
    relation: 'generalInfoFormData',
    field: 'height',
    useIs: true,
  },
  {
    minKey: 'partnerAgeMin',
    maxKey: 'partnerAgeMax',
    relation: 'spousePreferenceInfoFormData',
    field: 'partnerAge',
    useIs: true,
  },
  {
    minKey: 'partnerHeightMin',
    maxKey: 'partnerHeightMax',
    relation: 'spousePreferenceInfoFormData',
    field: 'partnerHeight',
    useIs: true,
  },
];
