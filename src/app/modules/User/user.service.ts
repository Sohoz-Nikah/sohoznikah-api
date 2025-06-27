/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  TokenStatus,
  TokenType,
  User,
  UserRole,
  VisibilityStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
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
    isDeleted: {
      not: true,
    },
  });

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      biodatas: {
        select: {
          id: true,
          code: true,
          status: true,
          visibility: true,
        },
      },
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
  user: JwtPayload,
  updateUserId: string,
  data: Partial<User & { biodataVisibility: VisibilityStatus }>,
) => {
  const { userId } = user;
  const { name, email, phoneNumber, role, status, isDeleted, emailConfirmed } =
    data;
  console.log('data', data);
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

  const updatedData: any = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(phoneNumber !== undefined && { phoneNumber }),
    ...(role !== undefined && { role }),
    ...(status && { status }), // this ensures status is not empty string
    ...(isDeleted !== undefined && { isDeleted }),
    ...(emailConfirmed !== undefined && { emailConfirmed }),
  };

  const result = await prisma.user.update({
    where: {
      id: updateUserId,
    },
    data: updatedData,
    include: {
      biodatas: {
        select: {
          id: true,
          code: true,
          status: true,
          visibility: true,
        },
      },
    },
  });
  // const result = await prisma.user.update({
  //   where: {
  //     id: updateUserId,
  //   },
  //   data: {
  //     name: data.name,
  //     email: data.email,
  //     phoneNumber: data.phoneNumber,
  //     role: data.role,
  //     status: data.status,
  //     isDeleted: data.isDeleted,
  //     emailConfirmed: data.emailConfirmed,
  //     token: data.token,
  //     biodatas: {
  //       update: {
  //         visibility: data.biodataVisibility,
  //       },
  //     },
  //   },
  // });

  const safeUser = exclude(result, [
    'passwordHash',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
  ]);

  return safeUser;
};

const giveToken = async (userId: string, payload: { token: number }) => {
  const { token } = payload;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.token.create({
    data: {
      tokenType: TokenType.CUSTOM,
      quantity: payload.token,
      totalPrice: 0,
      transactionId: '',
      phoneNumber: '',
      tokenStatus: TokenStatus.APPROVED,
      userId,
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      token: { increment: token },
    },
  });

  await prisma.notification.create({
    data: {
      type: 'TOKEN_GIVEN',
      message: `সহজনিকাহ থেকে আপনাকে ${token} টি টোকেন প্রদান করা হয়েছে।`,
      userId: userId,
    },
  });

  return result;
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

  const deleteUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  // const deleteUser = await prisma.user.update({
  //   where: {
  //     id: id,
  //   },
  //   data: {
  //     isDeleted: true,
  //   },
  // });

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
  giveToken,
  updateUser,
  deleteUser,
  analytics,
};
