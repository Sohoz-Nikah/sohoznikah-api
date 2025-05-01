/* eslint-disable @typescript-eslint/no-explicit-any */
import { FavouriteBiodata, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IFavouriteFilterRequest } from './favourite.interface';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import { paginationHelpers } from '../../helper/paginationHelper';
import { FavouriteSearchAbleFields } from './favourite.constant';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const createAFavourite = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<FavouriteBiodata> => {
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

  // Create new Favourite
  const newFavourite = await prisma.favouriteBiodata.create({
    data: {
      biodataId,
      userId,
    },
  });

  return newFavourite;
};

const getFilteredFavourite = async (
  filters: IFavouriteFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: FavouriteSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.FavouriteBiodataWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.favouriteBiodata.findMany({
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

  const total = await prisma.favouriteBiodata.count({
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

const getAFavourite = async (FavouriteId: string) => {
  const result = await prisma.favouriteBiodata.findUniqueOrThrow({
    where: {
      id: FavouriteId,
    },
  });

  return result;
};

const deleteAFavourite = async (
  FavouriteId: string,
): Promise<FavouriteBiodata> => {
  await prisma.favouriteBiodata.findFirstOrThrow({
    where: {
      id: FavouriteId,
    },
  });

  const result = await prisma.favouriteBiodata.delete({
    where: {
      id: FavouriteId,
    },
  });

  return result;
};

export const FavouriteServices = {
  createAFavourite,
  getFilteredFavourite,
  getAFavourite,
  deleteAFavourite,
};
