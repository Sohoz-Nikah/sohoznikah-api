/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import prisma from '../shared/prisma';

interface GenerateCodeProps {
  prefix: string;
  model: keyof PrismaClient;
  padStart?: number;
  gender?: string;
}

const generateUniqueCode = async ({
  prefix,
  model,
  gender,
}: GenerateCodeProps): Promise<string> => {
  const prismaModel = prisma[model as keyof PrismaClient];

  if (
    !prismaModel ||
    typeof prismaModel !== 'object' ||
    !('findMany' in prismaModel)
  ) {
    throw new Error(`Invalid Prisma model: ${String(model)}`);
  }

  const allCodes = await (prismaModel as any).findMany({
    where: {
      gender,
      code: {
        startsWith: `${prefix}-`,
      },
    },
    select: {
      code: true,
    },
  });

  const maxNumber = allCodes.reduce((max: number, entry: { code: string }) => {
    const parts = entry.code.split('-');
    const numberPart = parseInt(parts[1], 10);
    return numberPart > max ? numberPart : max;
  }, 0);

  const newNumber = maxNumber + 1;
  return `${prefix}-${newNumber}`;
};

export default generateUniqueCode;
