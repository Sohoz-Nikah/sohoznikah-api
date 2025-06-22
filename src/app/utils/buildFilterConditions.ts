// src/app/utils/buildFilterConditions.ts

export type RelationMap = Record<
  string,
  {
    relation: string;
    field: string;
    isArray?: boolean; // Indicates if the field is an array (like String[])
    useIs?: boolean; // Indicates if relation is one-to-one (true = use `is`, false = use `some`)
    transform?: (value: string) => string;
  }[]
>;

export function buildFilterConditions(
  filterData: Record<string, any>,
  relationFieldMap: RelationMap,
): Record<string, any> {
  const directClauses: any[] = [];
  const orClausesForSpecial: any[] = [];
  const rels: Record<string, { useIs: boolean; conditions: any[] }> = {};

  for (const [key, value] of Object.entries(filterData)) {
    if (value == null || value === '') continue;

    const mappings = relationFieldMap[key];
    const rawValues = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map(v => v.trim())
          .filter(v => v !== '');

    console.log('rawValues', rawValues);

    if (!mappings) {
      if (rawValues.length > 1) {
        directClauses.push({ [key]: { in: rawValues } });
      } else {
        directClauses.push({ [key]: { equals: rawValues[0] } });
      }
      continue;
    }

    // ✅ Handle specialCategory separately as OR filter
    if (key === 'specialCategory') {
      for (const { relation, field, isArray, transform, useIs } of mappings) {
        const transformedValues = transform
          ? rawValues.map(v => transform(v)).filter(v => v !== '')
          : rawValues;
        if (!transformedValues.length) continue;

        const clause = useIs
          ? {
              [relation]: {
                is: {
                  [field]: isArray
                    ? transformedValues.length > 1
                      ? { hasSome: transformedValues }
                      : { has: transformedValues[0] }
                    : transformedValues.length > 1
                      ? { in: transformedValues }
                      : { equals: transformedValues[0] },
                },
              },
            }
          : {
              [relation]: {
                some: {
                  [field]: isArray
                    ? transformedValues.length > 1
                      ? { hasSome: transformedValues }
                      : { has: transformedValues[0] }
                    : transformedValues.length > 1
                      ? { in: transformedValues }
                      : { equals: transformedValues[0] },
                },
              },
            };
        orClausesForSpecial.push(clause);
      }
      continue;
    }

    // ✅ Normal relation filter building
    for (const { relation, field, isArray, transform, useIs } of mappings) {
      const values = transform
        ? rawValues.map(v => transform(v)).filter(v => v !== '')
        : rawValues;
      if (!values.length) continue;

      rels[relation] ||= {
        useIs: !!useIs,
        conditions: [],
      };

      const condition = isArray
        ? {
            [field]:
              values.length > 1 ? { hasSome: values } : { has: values[0] },
          }
        : {
            [field]: values.length > 1 ? { in: values } : { equals: values[0] },
          };

      rels[relation].conditions.push(condition);
    }
  }

  // ✅ Final Prisma where object
  const where: any = {};
  const andClauses: any[] = [];

  if (directClauses.length) {
    andClauses.push(...directClauses);
  }

  for (const [relation, { useIs, conditions }] of Object.entries(rels)) {
    if (!conditions.length) continue;

    const relationClause = useIs
      ? { [relation]: { is: { AND: conditions } } }
      : { [relation]: { some: { AND: conditions } } };

    andClauses.push(relationClause);
  }

  if (orClausesForSpecial.length) {
    andClauses.push({ OR: orClausesForSpecial });
  }

  if (andClauses.length) {
    where.AND = andClauses;
  }

  // ✅ Debug log
  // console.log('---------------------------------------');
  // console.log('filterData', JSON.stringify(filterData, null, 2));
  // console.log('where', JSON.stringify(where, null, 2));
  // console.log('andClauses', JSON.stringify(andClauses, null, 2));
  // console.log(
  //   'orClausesForSpecial',
  //   JSON.stringify(orClausesForSpecial, null, 2),
  // );
  // console.log('directClauses', JSON.stringify(directClauses, null, 2));
  // console.log('rels', JSON.stringify(rels, null, 2));
  // console.log('---------------------------------------');

  return where;
}
