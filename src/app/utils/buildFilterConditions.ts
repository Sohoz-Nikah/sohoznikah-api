export type RelationMap = Record<
  string,
  {
    relation: string;
    field: string;
    isArray?: boolean;
    transform?: (value: string) => string;
  }[]
>;

export function buildFilterConditions(
  filterData: Record<string, any>,
  relationFieldMap: RelationMap,
): Record<string, any> {
  const direct: any[] = [];
  const rels: Record<string, any[]> = {};
  console.log('filterData', filterData);
  console.log('--------------------------------');

  for (const [key, value] of Object.entries(filterData)) {
    if (value == null || value === '') continue;

    const mappings = relationFieldMap[key];
    const rawValues = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map(v => v.trim());

    if (mappings) {
      for (const { relation, field, isArray, transform } of mappings) {
        rels[relation] ||= [];

        // Apply transform if available
        const values = transform ? rawValues.map(v => transform(v)) : rawValues;

        if (isArray) {
          rels[relation].push({
            [field]: { hasSome: values },
          });
        } else {
          rels[relation].push({
            [field]: values.length > 1 ? { in: values } : { equals: values[0] },
          });
        }
      }
    } else {
      const values = rawValues;
      if (values.length > 1) {
        direct.push({ [key]: { in: values } });
      } else {
        direct.push({ [key]: { equals: values[0] } });
      }
    }
  }

  const where: any = {};
  if (direct.length) where.AND = [...direct];
  for (const [relation, conditions] of Object.entries(rels)) {
    where.AND = [
      ...(where.AND ?? []),
      { [relation]: { some: { AND: conditions } } },
    ];
  }
  console.log('where', JSON.stringify(where, null, 2));
  console.log('--------------------------------');
  return where;
}
