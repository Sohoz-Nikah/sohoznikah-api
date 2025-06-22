import { format, subYears } from 'date-fns';

interface RangeConfig {
  minKey: string;
  maxKey: string;
  relation: string;
  field: string;
  useIs?: boolean;
}

export function buildRangeConditions(
  filters: Record<string, any>,
  rangeConfigs: RangeConfig[],
): Record<string, any>[] {
  return rangeConfigs.flatMap(
    ({ minKey, maxKey, relation, field, useIs }): Record<string, any>[] => {
      const rawMin = filters[minKey];
      const rawMax = filters[maxKey];

      const gte = typeof rawMin === 'number' ? rawMin : Number(rawMin);
      const lte = typeof rawMax === 'number' ? rawMax : Number(rawMax);

      const isGteValid = !isNaN(gte);
      const isLteValid = !isNaN(lte);

      if (!isGteValid && !isLteValid) return [];

      // 🔁 Special case for age filter applied on dateOfBirth
      if (field === 'dateOfBirth') {
        const today = new Date();

        const dobCondition: Record<string, any> = {};
        if (isLteValid)
          dobCondition.gte = format(subYears(today, lte), 'yyyy-MM-dd');
        if (isGteValid)
          dobCondition.lte = format(subYears(today, gte), 'yyyy-MM-dd');

        return [
          {
            [relation]: {
              [useIs ? 'is' : 'some']: {
                dateOfBirth: dobCondition,
              },
            },
          },
        ];
      }

      // 🔁 Handle string fields like height or weight
      const stringFields = ['height', 'weight'];

      const castValue = (field: string, value: number) =>
        stringFields.includes(field) ? String(value) : value;

      const conditions: Record<string, any>[] = [];

      if (isGteValid)
        conditions.push({ [field]: { gte: castValue(field, gte) } });
      if (isLteValid)
        conditions.push({ [field]: { lte: castValue(field, lte) } });

      return [
        {
          [relation]: {
            [useIs ? 'is' : 'some']: {
              AND: conditions,
            },
          },
        },
      ];
    },
  );
}
