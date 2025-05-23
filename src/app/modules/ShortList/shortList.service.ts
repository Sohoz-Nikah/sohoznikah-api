/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, ShortlistBiodata } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { ShortlistSearchAbleFields } from './shortList.constant';
import { IShortlistFilterRequest } from './shortList.interface';

const createAShortlist = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<ShortlistBiodata> => {
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

  // Create new Shortlist
  const newShortlist = await prisma.shortlistBiodata.create({
    data: {
      biodataId,
      userId,
    },
  });

  return newShortlist;
};

const getFilteredShortlist = async (
  filters: IShortlistFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ShortlistSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.ShortlistBiodataWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.shortlistBiodata.findMany({
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

  const total = await prisma.shortlistBiodata.count({
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

const getAShortlist = async (biodataId: string, userId: string) => {
  const result = await prisma.shortlistBiodata.findFirst({
    where: {
      biodataId: biodataId,
      userId,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shortlist not found');
  }
  return result;
};

const deleteAShortlist = async (ShortlistId: string, userId: string) => {
  const existingShortlist = await prisma.shortlistBiodata.findFirst({
    where: {
      id: ShortlistId,
      userId,
    },
  });

  if (!existingShortlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shortlist not found');
  }

  const result = await prisma.shortlistBiodata.delete({
    where: {
      id: ShortlistId,
    },
  });

  return result;
};

export const ShortlistServices = {
  createAShortlist,
  getFilteredShortlist,
  getAShortlist,
  deleteAShortlist,
};
