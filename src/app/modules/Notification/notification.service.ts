/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import { INotificationFilterRequest } from './notification.interface';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import { paginationHelpers } from '../../helper/paginationHelper';
import { NotificationSearchAbleFields } from './notification.constant';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const createANotification = async (
  req: Record<string, any>,
): Promise<Notification> => {
  const { biodataId, userId } = req.body;

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

  // Create new Notification
  const newNotification = await prisma.notification.create({
    data: req.body,
  });

  return newNotification;
};

const getFilteredNotification = async (
  filters: INotificationFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: NotificationSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.NotificationWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.notification.findMany({
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

  const total = await prisma.notification.count({
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

const getANotification = async (NotificationId: string, userId: JwtPayload) => {
  const result = await prisma.notification.findUniqueOrThrow({
    where: {
      id: NotificationId,
    },
  });

  if (userId && userId.id !== result.userId) {
    await prisma.notification.update({
      where: {
        id: NotificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  return result;
};

const updateANotification = async (
  NotificationId: string,
  data: Partial<Notification>,
): Promise<Notification> => {
  // Check if the Notification exists
  const existingNotification = await prisma.notification.findUnique({
    where: { id: NotificationId },
  });

  if (!existingNotification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  const { biodataId, userId } = data;

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

  // Update the Notification
  const updatedNotification = await prisma.notification.update({
    where: { id: NotificationId },
    data,
  });

  return updatedNotification;
};

const deleteANotification = async (
  NotificationId: string,
): Promise<Notification> => {
  await prisma.notification.findFirstOrThrow({
    where: {
      id: NotificationId,
    },
  });

  const result = await prisma.notification.delete({
    where: {
      id: NotificationId,
    },
  });

  return result;
};

export const NotificationServices = {
  createANotification,
  getFilteredNotification,
  getANotification,
  updateANotification,
  deleteANotification,
};
