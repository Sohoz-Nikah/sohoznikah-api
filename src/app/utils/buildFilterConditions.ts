export type RelationMap = Record<
  string,
  {
    relation: string;
    field: string;
    isArray?: boolean;
    useIs?: boolean;
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

    if (!mappings) {
      if (rawValues.length > 1) {
        directClauses.push({ [key]: { in: rawValues } });
      } else {
        directClauses.push({ [key]: { equals: rawValues[0] } });
      }
      continue;
    }

    // Handle specialCategory (OR filter across models)
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
                  [field]:
                    transformedValues.length > 1
                      ? { in: transformedValues }
                      : { equals: transformedValues[0] },
                },
              },
            }
          : isArray
            ? {
                [relation]: {
                  some: {
                    [field]: { hasSome: transformedValues },
                  },
                },
              }
            : {
                [relation]: {
                  some: {
                    [field]:
                      transformedValues.length > 1
                        ? { in: transformedValues }
                        : { equals: transformedValues[0] },
                  },
                },
              };

        orClausesForSpecial.push(clause);
      }
      continue;
    }

    // Normal filter mapping (grouped by relation)
    for (const { relation, field, isArray, transform, useIs } of mappings) {
      const values = transform
        ? rawValues.map(v => transform(v)).filter(v => v !== '')
        : rawValues;
      if (!values.length) continue;

      rels[relation] ||= {
        useIs: !!useIs,
        conditions: [],
      };

      const condition =
        isArray && !useIs
          ? { [field]: { hasSome: values } }
          : {
              [field]:
                values.length > 1 ? { in: values } : { equals: values[0] },
            };

      rels[relation].conditions.push(condition);
    }
  }

  // Build the final Prisma `where` object
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
  console.log('---------------------------------------');
  console.log('where', JSON.stringify(where, null, 2));
  console.log('andClauses', JSON.stringify(andClauses, null, 2));
  console.log(
    'orClausesForSpecial',
    JSON.stringify(orClausesForSpecial, null, 2),
  );
  console.log('directClauses', JSON.stringify(directClauses, null, 2));
  console.log('rels', JSON.stringify(rels, null, 2));
  console.log('---------------------------------------');
  return where;
}
