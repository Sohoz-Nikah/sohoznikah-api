/* eslint-disable @typescript-eslint/no-explicit-any */
import { FavouriteBiodata, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { FavouriteSearchAbleFields } from './favourite.constant';
import { IFavouriteFilterRequest } from './favourite.interface';

const createAFavourite = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<FavouriteBiodata | null> => {
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

  const existingFavourite = await prisma.favouriteBiodata.findFirst({
    where: {
      biodataId,
      userId,
    },
  });

  if (existingFavourite) {
    await prisma.favouriteBiodata.delete({
      where: {
        id: existingFavourite.id,
      },
    });
    return null;
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

const getAFavourite = async (biodataId: string, userId: string) => {
  const result = await prisma.favouriteBiodata.findFirst({
    where: {
      biodataId: biodataId,
      userId,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  return result;
};

const deleteAFavourite = async (
  FavouriteId: string,
  userId: string,
): Promise<FavouriteBiodata> => {
  console.log(FavouriteId, 'FavouriteId');
  const existingFavourite = await prisma.favouriteBiodata.findFirst({
    where: {
      id: FavouriteId,
      userId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
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
