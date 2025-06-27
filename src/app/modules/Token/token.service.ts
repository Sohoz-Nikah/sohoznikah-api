/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Token, TokenStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { TokenSearchAbleFields } from './token.constant';
import { ITokenFilterRequest } from './token.interface';

const createAToken = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<Token | null> => {
  const { userId } = user;
  // console.log(payload);
  // Create new Token
  const newToken = await prisma.token.create({
    data: {
      tokenType: payload.tokenType,
      quantity: payload.quantity,
      totalPrice: payload.totalPrice,
      transactionId: payload.transactionId,
      phoneNumber: payload.phoneNumber,
      userId,
    },
  });

  await prisma.notification.create({
    data: {
      type: 'TOKEN_CREATED',
      adminMessage: `New Token request generated.`,
      isAdmin: true,
      userId: userId,
    },
  });

  return newToken;
};

const getFilteredToken = async (
  filters: ITokenFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload,
) => {
  const { userId, role } = user;
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.TokenWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: TokenSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (role === UserRole.USER) {
    andConditions.push({
      userId: userId,
      tokenStatus: TokenStatus.APPROVED,
    });
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

  const whereConditions: Prisma.TokenWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.token.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      user: true,
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

  const total = await prisma.token.count({
    where: whereConditions,
  });

  const resultWithUser = result.map(token => ({
    id: token.id,
    tokenType: token.tokenType,
    quantity: token.quantity,
    totalPrice: token.totalPrice,
    transactionId: token.transactionId,
    phoneNumber: token.phoneNumber,
    tokenStatus: token.tokenStatus,
    userId: token.userId,
    userName: token.user.name,
    userEmail: token.user.email,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
  }));

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: resultWithUser,
  };
};

const getAToken = async (biodataId: string, userId: string) => {
  const result = await prisma.token.findFirst({
    where: {
      userId,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return result;
};

const updateAToken = async (
  id: string,
  payload: Partial<Token>,
  user: JwtPayload,
) => {
  const { tokenStatus, userId } = payload;
  const existingToken = await prisma.token.findFirst({
    where: {
      id,
      userId,
    },
  });
  if (!existingToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  let updatedToken;
  if (tokenStatus === TokenStatus.APPROVED) {
    updatedToken = await prisma.token.update({
      where: {
        id,
        userId,
      },
      data: {
        tokenStatus: TokenStatus.APPROVED,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        token: {
          increment: existingToken.quantity,
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: existingToken.userId,
        message: `আপনার ক্রয়কৃত ${existingToken.quantity} টি টোকেন প্রদান করা হয়েছে।`,
        type: 'TOKEN_APPROVED',
      },
    });
  } else {
    updatedToken = await prisma.token.update({
      where: {
        id,
        userId,
      },
      data: {
        tokenStatus: TokenStatus.REJECTED,
      },
    });
  }
  return updatedToken;
};

const deleteAToken = async (
  TokenId: string,
  user: JwtPayload,
): Promise<Token> => {
  const { userId, role } = user;
  const existingToken = await prisma.token.findFirst({
    where: {
      id: TokenId,
      userId,
    },
  });

  const result = await prisma.token.delete({
    where: {
      id: TokenId,
    },
  });

  return result;
};

export const TokenServices = {
  createAToken,
  getFilteredToken,
  getAToken,
  updateAToken,
  deleteAToken,
};
