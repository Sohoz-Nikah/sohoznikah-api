/* eslint-disable @typescript-eslint/no-explicit-any */
import { FavouriteBiodata, Prisma, UserRole } from '@prisma/client';
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

  const existingBiodata = await prisma.biodata.findUnique({
    where: { id: biodataId },
  });

  if (!existingBiodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
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

  await prisma.notification.create({
    data: {
      type: 'FAVOURITE_CREATED',
      message: `আপনার বায়োডাটা একজন পছন্দের তালিকায় রেখেছে।`,
      userId: existingBiodata?.userId,
    },
  });

  return newFavourite;
};

const getFilteredFavourite = async (
  filters: IFavouriteFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload,
) => {
  const { userId, role } = user;
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, type, ...filterData } = filters;

  const andConditions: Prisma.FavouriteBiodataWhereInput[] = [];

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

  if (role === UserRole.USER) {
    if (type === 'sent') {
      andConditions.push({ userId: userId });
    } else if (type === 'received') {
      andConditions.push({
        biodata: {
          userId: userId,
        },
      });
    } else {
      // Both types
      andConditions.push({
        OR: [
          { userId: userId },
          {
            biodata: {
              userId: userId,
            },
          },
        ],
      });
    }
  }

  // Add additional filters
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
    include: {
      // user: true,
      biodata: {
        include: {
          addressInfoFormData: true,
        },
      }, // Include related data
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.favouriteBiodata.count({
    where: whereConditions,
  });

  const favouriteData = result.map(favourite => {
    const currentAddress = favourite?.biodata?.addressInfoFormData?.find(
      item => item.type === 'current_address',
    );

    const permanentAddresses = favourite?.biodata?.addressInfoFormData?.find(
      item => item.type === 'permanent_address',
    );

    return {
      id: favourite.id,
      userId: favourite.userId,
      biodataId: favourite.biodataId,
      bioNo: favourite?.biodata?.code,
      isShortlisted: favourite?.isShortlisted,
      bioVisibility: favourite?.biodata?.visibility,
      bioPresentCity: currentAddress?.city,
      bioPresentState: currentAddress?.state,
      bioPermanentCity: permanentAddresses?.city,
      bioPermanentState: permanentAddresses?.state,
      createdAt: favourite?.createdAt,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: favouriteData,
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
  user: JwtPayload,
): Promise<FavouriteBiodata> => {
  const { userId, role } = user;
  const existingFavourite = await prisma.favouriteBiodata.findFirst({
    where: {
      id: FavouriteId,
      userId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  const shortlistData = await prisma.shortlistBiodata.findFirst({
    where: {
      biodataId: existingFavourite?.biodataId,
      userId,
    },
  });
  if (shortlistData) {
    await prisma.shortlistBiodata.delete({
      where: {
        id: shortlistData?.id,
      },
    });
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
