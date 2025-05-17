export const BiodataSearchAbleFields: string[] = ['name', 'code'];

export const BiodataFilterableFields: string[] = [
  'searchTerm',
  'biodataType',
  'age',
  'maritalStatus',
  'code',
  'status',
  'visibility',
];

export const relationFieldMap: Record<
  string,
  { relation: string; field: string }
> = {
  biodataType: {
    relation: 'primaryInfos',
    field: 'biodataType',
  },
};
