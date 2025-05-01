/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProposalBiodata, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IProposalFilterRequest } from './proposal.interface';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import { paginationHelpers } from '../../helper/paginationHelper';
import { ProposalSearchAbleFields } from './proposal.constant';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const createAProposal = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<ProposalBiodata> => {
  const { biodataId } = payload;
  const { userId } = user;
  if (biodataId) {
    const existingBiodata = await prisma.biodata.findUnique({
      where: { id: biodataId },
    });

    if (!existingBiodata) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
    }
  }
  if (userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  }

  // Create new Proposal
  const newProposal = await prisma.ProposalBiodata.create({
    data: {
      biodataId,
      userId,
    },
  });

  return newProposal;
};

const getFilteredProposal = async (
  filters: IProposalFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ProposalSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
            mode: 'insensitive',
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ProposalBiodataWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.ProposalBiodata.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            id: 'desc',
          },
  });

  const total = await prisma.ProposalBiodata.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result, // Return mapped data
  };
};

const getAProposal = async (ProposalId: string) => {
  const result = await prisma.ProposalBiodata.findUniqueOrThrow({
    where: {
      id: ProposalId,
    },
  });

  return result;
};

const deleteAProposal = async (
  ProposalId: string,
): Promise<ProposalBiodata> => {
  await prisma.ProposalBiodata.findFirstOrThrow({
    where: {
      id: ProposalId,
    },
  });

  const result = await prisma.ProposalBiodata.delete({
    where: {
      id: ProposalId,
    },
  });

  return result;
};

export const ProposalServices = {
  createAProposal,
  getFilteredProposal,
  getAProposal,
  deleteAProposal,
};
