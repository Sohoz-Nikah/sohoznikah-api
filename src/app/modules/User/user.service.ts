/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, User, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { exclude } from '../../helper/exclude';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { UserSearchAbleFields } from './user.constant';
import { IUserFilterRequest } from './user.interface';

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: UserSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    email: {
      not: config.super_admin.email,
    },
  });

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  // Exclude sensitive fields
  const safeUsers = users.map(user =>
    exclude(user, ['passwordHash', 'otp', 'otpExpiry', 'passwordChangedAt']),
  );

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: safeUsers, // Return users without sensitive data
  };
};

const getSingleUser = async (id: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const safeUser = exclude(user, [
    'passwordHash',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
  ]);

  return safeUser;
};

const getMyProfile = async (userId: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const safeUser = exclude(user, [
    'passwordHash',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
  ]);

  return safeUser;
};

const updateMyProfile = async (
  userId: string,
  data: Partial<User>,
): Promise<Partial<User>> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userId,
      role: user.role,
    },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
  });

  const safeUser = exclude(result, [
    'passwordHash',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
  ]);

  return safeUser;
};

const updateUser = async (
  userId: string,
  updateUserId: string,
  data: Partial<User>,
) => {
  const updateBy = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: updateUserId,
    },
  });

  if (
    updateBy.role === UserRole.SUPER_ADMIN &&
    updatedUser.role === UserRole.SUPER_ADMIN
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this user!',
    );
  }
  const result = await prisma.user.update({
    where: {
      id: updateUserId,
    },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
      status: data.status,
      isDeleted: data.isDeleted,
    },
  });

  const safeUser = exclude(result, [
    'passwordHash',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
  ]);

  return safeUser;
};

const deleteUser = async (id: string, userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const deletedBy = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    deletedBy.role === UserRole.SUPER_ADMIN &&
    user.role === UserRole.SUPER_ADMIN
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this user!',
    );
  }
  if (user.isDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, 'This user is already deleted!');
  }

  const deleteUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deleteUser;
};

const analytics = async () => {
  const totalAdmins = await prisma.user.count({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });
  const totalManager = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  // Count users by statuses

  return {
    totalAdmins,
    totalManager,
  };
};

export const UserServices = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  analytics,
};
