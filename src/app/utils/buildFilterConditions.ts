export type RelationMap = Record<
  string,
  { relation: string; field: string; isArray?: boolean }
>;

export function buildFilterConditions(
  filterData: Record<string, any>,
  relationFieldMap: RelationMap,
): Record<string, any> {
  const direct: any[] = [];
  const rels: Record<string, any[]> = {};

  for (const [key, value] of Object.entries(filterData)) {
    if (value == null || value === '') continue;

    const mapping = relationFieldMap[key];
    const values = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map(v => v.trim());

    if (mapping) {
      const { relation, field, isArray } = mapping;
      rels[relation] ||= [];

      if (isArray) {
        rels[relation].push({
          [field]: {
            hasSome: values, // for String[] fields like occupations
          },
        });
      } else {
        if (values.length > 1) {
          rels[relation].push({
            [field]: {
              in: values, // for scalar string with multiple values
            },
          });
        } else {
          rels[relation].push({
            [field]: {
              equals: values[0], // exact match for one value
            },
          });
        }
      }
    } else {
      if (values.length > 1) {
        direct.push({
          [key]: {
            in: values,
          },
        });
      } else {
        direct.push({
          [key]: {
            equals: values[0],
          },
        });
      }
    }
  }

  const where: any = {};
  if (direct.length) where.AND = [...direct];
  for (const [relation, conditions] of Object.entries(rels)) {
    where.AND = [
      ...(where.AND ?? []),
      {
        [relation]: {
          some: {
            AND: conditions,
          },
        },
      },
    ];
  }

  return where;
}
