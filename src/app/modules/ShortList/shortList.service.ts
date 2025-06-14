/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, ShortlistBiodata, UserRole } from '@prisma/client';
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
): Promise<ShortlistBiodata | null> => {
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

  const existingShortlist = await prisma.shortlistBiodata.findFirst({
    where: {
      biodataId,
      userId,
    },
  });

  if (existingShortlist) {
    await prisma.favouriteBiodata.delete({
      where: {
        userId_biodataId: {
          userId,
          biodataId,
        },
      },
    });

    await prisma.shortlistBiodata.delete({
      where: {
        id: existingShortlist.id,
      },
    });
    return null;
  } else {
    // 1. Create new Shortlist
    const newShortlist = await prisma.shortlistBiodata.create({
      data: {
        biodataId,
        userId,
      },
    });

    // 2. Try to update favouriteBiodata if it exists
    const favourite = await prisma.favouriteBiodata.findUnique({
      where: {
        userId_biodataId: {
          userId,
          biodataId,
        },
      },
    });

    let updatedFavourite;

    if (favourite) {
      updatedFavourite = await prisma.favouriteBiodata.update({
        where: {
          userId_biodataId: {
            userId,
            biodataId,
          },
        },
        data: {
          isShortlisted: true,
        },
      });
      console.log(updatedFavourite, 'favourite updated');
    } else {
      // Optional: create it instead
      updatedFavourite = await prisma.favouriteBiodata.create({
        data: {
          userId,
          biodataId,
          isShortlisted: true,
        },
      });
    }
    await prisma.notification.create({
      data: {
        type: 'SHORTLIST_CREATED',
        message: `আপনার বায়োডাটা একজন চুড়ান্ত তালিকায় রেখেছে।`,
        userId: existingBiodata?.userId,
      },
    });
    return newShortlist;
  }
};

const getFilteredShortlist = async (
  filters: IShortlistFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload,
) => {
  const { userId, role } = user;
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

  if (role === UserRole.USER) {
    andConditions.push({
      userId,
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
            id: 'desc',
          },
  });

  const total = await prisma.shortlistBiodata.count({
    where: whereConditions,
  });

  const shortlistData = result.map(shortlist => {
    const currentAddress = shortlist?.biodata?.addressInfoFormData?.find(
      item => item.type === 'current_address',
    );

    const permanentAddresses = shortlist?.biodata?.addressInfoFormData?.find(
      item => item.type === 'permanent_address',
    );

    return {
      id: shortlist.id,
      biodataId: shortlist.biodataId,
      userId: shortlist.userId,
      bioNo: shortlist?.biodata?.code,
      bioPresentCity: currentAddress?.city,
      bioPresentState: currentAddress?.state,
      bioPermanentCity: permanentAddresses?.city,
      bioPermanentState: permanentAddresses?.state,
      createdAt: shortlist?.createdAt,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: shortlistData, // Return mapped data
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

const deleteAShortlist = async (ShortlistId: string, user: JwtPayload) => {
  const { role, userId } = user;

  if (role === UserRole.USER) {
    const existingShortlist = await prisma.shortlistBiodata.findFirst({
      where: {
        id: ShortlistId,
        userId,
      },
    });

    if (!existingShortlist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shortlist not found');
    }
    await prisma.favouriteBiodata.delete({
      where: {
        userId_biodataId: {
          userId,
          biodataId: existingShortlist.biodataId,
        },
      },
    });

    await prisma.shortlistBiodata.delete({
      where: {
        id: ShortlistId,
        userId,
      },
    });

    return null;
  } else {
    const existingShortlist = await prisma.shortlistBiodata.findUnique({
      where: {
        id: ShortlistId,
      },
    });
    if (!existingShortlist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shortlist not found');
    }

    await prisma.favouriteBiodata.delete({
      where: {
        userId_biodataId: {
          userId: existingShortlist.userId,
          biodataId: existingShortlist.biodataId,
        },
      },
    });

    await prisma.shortlistBiodata.delete({
      where: {
        id: ShortlistId,
      },
    });

    return null;
  }
};

export const ShortlistServices = {
  createAShortlist,
  getFilteredShortlist,
  getAShortlist,
  deleteAShortlist,
};
