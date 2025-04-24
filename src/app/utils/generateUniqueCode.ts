/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import prisma from "../shared/prisma";

interface GenerateCodeProps {
  prefix: string;
  model: keyof PrismaClient;
  padStart?: number;
}

const generateUniqueCode = async ({
  prefix,
  model,
}: GenerateCodeProps): Promise<string> => {
  const prismaModel = prisma[model as keyof PrismaClient];

  // Check if model exists in Prisma
  if (
    !prismaModel ||
    typeof prismaModel !== "object" ||
    !("findFirst" in prismaModel)
  ) {
    throw new Error(`Invalid Prisma model: ${String(model)}`);
  }

  // Find the latest entry based on the code
  const lastEntry = await (prismaModel as any).findFirst({
    orderBy: { code: "desc" },
    select: { code: true },
  });

  // Extract last number from the code (e.g., C-009 → 9, SC-021 → 21)
  const lastNumber = lastEntry?.code
    ? parseInt(lastEntry.code.split("-")[1], 10)
    : 0;
  const newNumber = lastNumber + 1;

  // Generate new unique code (e.g., M-1, F-1)
  return `${prefix}-${String(newNumber)}`;
};

export default generateUniqueCode;
