/* eslint-disable @typescript-eslint/no-explicit-any */

export const buildFilterConditions = (
  filterData: Record<string, any>,
  relationFieldMap: Record<string, any>,
) => {
  const directConditions: any[] = [];
  const relationConditions: Record<string, any[]> = {};

  for (const [key, value] of Object.entries(filterData)) {
    if (!value) continue;

    if (relationFieldMap[key]) {
      const { relation, field } = relationFieldMap[key];
      if (!relationConditions[relation]) {
        relationConditions[relation] = [];
      }

      relationConditions[relation].push({
        [field]: {
          equals: value,
        },
      });
    } else {
      directConditions.push({
        [key]: {
          equals: value,
        },
      });
    }
  }

  const prismaWhere: any = {};
  if (directConditions.length > 0) {
    prismaWhere.AND = [...directConditions];
  }

  for (const [relation, conditions] of Object.entries(relationConditions)) {
    if (!prismaWhere.AND) prismaWhere.AND = [];

    prismaWhere.AND.push({
      [relation]: {
        some: {
          AND: conditions,
        },
      },
    });
  }

  return prismaWhere;
};
