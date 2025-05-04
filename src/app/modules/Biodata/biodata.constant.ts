export const BiodataSearchAbleFields: string[] = ['name'];

export const BiodataFilterableFields: string[] = [
  'searchTerm',
  'biodataType',
  'age',
  'maritalStatus',
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
