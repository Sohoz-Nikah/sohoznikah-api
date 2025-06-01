/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContactAccess, ContactStatus, Prisma, UserRole } from '@prisma/client';
import { addHours } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { ContactSearchAbleFields } from './contact.constant';
import { IContactFilterRequest } from './contact.interface';

const createAContact = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<ContactAccess> => {
  const { biodataId } = payload;
  const { userId } = user;

  if (!biodataId || !userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing biodata or user ID');
  }

  const existingBiodata = await prisma.biodata.findUnique({
    where: { id: biodataId },
  });

  if (!existingBiodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if already sent Contact
  const alreadySent = await prisma.contactAccess.findFirst({
    where: {
      senderId: userId,
      receiverId: existingBiodata.userId,
      biodataId,
      contactStatus: { in: ['PENDING'] },
    },
  });

  if (alreadySent) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'You have already sent a Contact Request',
    );
  }

  if (existingUser.token < 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough tokens');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { token: { decrement: 2 } },
  });

  // Create Contact
  const newContact = await prisma.contactAccess.create({
    data: {
      biodataId,
      senderId: userId,
      receiverId: existingBiodata.userId,
      contactExpiredAt: addHours(new Date(), 72),
    },
  });

  if (!newContact) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create Contact',
    );
  }
  // Optional: Log update
  await prisma.notification.create({
    data: {
      type: 'Got New Contact',
      message: `You have got new Contact from : ${existingUser.name}`,
      userId: existingBiodata.userId,
      contactAccessId: newContact.id,
    },
  });

  return newContact;
};

const getFilteredContact = async (
  filters: IContactFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload,
) => {
  const { userId, role } = user;
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, type, status, ...filterData } = filters;
  const andConditions: Prisma.ContactAccessWhereInput[] = [];
  // Search term
  if (searchTerm) {
    andConditions.push({
      OR: ContactSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Filter by status
  // if (status) {
  //   andConditions.push({
  //     status: status,
  //   });
  // }

  // Role-based access filtering
  if (role === 'USER') {
    if (type === 'sent') {
      andConditions.push({ senderId: userId });
    } else if (type === 'received') {
      andConditions.push({ receiverId: userId });
    } else {
      // Default: return both sent and received
      andConditions.push({
        OR: [{ senderId: userId }, { receiverId: userId }],
      });
    }
  }

  // Additional filter fields (optional)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.ContactAccessWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.contactAccess.findMany({
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

  // console.log(result);

  const total = await prisma.contactAccess.count({
    where: whereConditions,
  });

  const ContactData = result.map(Contact => {
    const currentAddress = Contact?.biodata?.addressInfoFormData?.find(
      item => item.type === 'current_address',
    );

    const permanentAddresses = Contact?.biodata?.addressInfoFormData?.find(
      item => item.type === 'permanent_address',
    );

    return {
      id: Contact.id,
      senderId: Contact.senderId,
      receiverId: Contact.receiverId,
      biodataId: Contact.biodataId,
      bioNo: Contact?.biodata?.code,
      bioVisibility: Contact?.biodata?.visibility,
      bioPresentCity: currentAddress?.city,
      bioPresentState: currentAddress?.state,
      bioPermanentCity: permanentAddresses?.city,
      bioPermanentState: permanentAddresses?.state,
      createdAt: Contact?.createdAt,
      respondedAt: Contact?.respondedAt,
      isDeleted: Contact?.isDeleted,
      tokenSpent: Contact?.tokenSpent,
      contactExpiredAt: Contact?.contactExpiredAt,
      contactStatus: Contact?.contactStatus,
      tokenRefunded: Contact?.tokenRefunded,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: ContactData,
  };
};

const getAContact = async (ContactId: string, user: JwtPayload) => {
  const { userId, role } = user;
  let result: ContactAccess | null = null;
  if (role === 'USER') {
    result = await prisma.contactAccess.findFirst({
      where: {
        id: ContactId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
  } else {
    result = await prisma.contactAccess.findUnique({
      where: { id: ContactId },
    });
  }

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }

  return result;
};

// const cancelContact = async (ContactId: string, user: JwtPayload) => {
//   const { userId, role } = user;

//   if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'You are not allowed to cancel Contact',
//     );
//   }

//   const Contact = await prisma.contactAccess.findUnique({
//     where: { id: ContactId, senderId: userId },
//   });

//   if (!Contact) throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');

//   if (Contact.contactExpiredAt && Contact.contactExpiredAt > new Date()) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'You cannot cancel Contact before 72 hours',
//     );
//   }

//   return prisma.contactAccess.update({
//     where: { id: ContactId, senderId: userId },
//     data: { isCancelled: true },
//   });
// };

const updateContactResponse = async (
  ContactId: string,
  payload: Record<string, any>,
  user: JwtPayload,
) => {
  const { userId } = user;
  const Contact = await prisma.contactAccess.findUnique({
    where: { id: ContactId, receiverId: userId },
  });

  if (!Contact) throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');

  if (payload.response === 'YES') {
    return prisma.contactAccess.update({
      where: { id: ContactId },
      data: {
        contactStatus: ContactStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });
  } else {
    return prisma.contactAccess.update({
      where: { id: ContactId },
      data: {
        contactStatus: ContactStatus.REJECTED,
        respondedAt: new Date(),
      },
    });
  }
};

const deleteAContact = async (
  ContactId: string,
  user: JwtPayload,
): Promise<ContactAccess> => {
  const { userId, role } = user;
  const Contact = await prisma.contactAccess.findFirstOrThrow({
    where: {
      id: ContactId,
    },
  });

  let result;
  if (role === UserRole.USER) {
    if (Contact.senderId !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to delete this Contact',
      );
    }

    result = await prisma.contactAccess.delete({
      where: {
        id: ContactId,
        senderId: userId,
      },
    });

    return result;
  }

  // if (role === UserRole.ADMIN) {
  //   if (Contact.senderId !== userId) {
  //     throw new ApiError(
  //       httpStatus.FORBIDDEN,
  //       'You are not allowed to delete this Contact',
  //     );
  //   }
  // }

  result = await prisma.contactAccess.delete({
    where: {
      id: ContactId,
    },
  });

  return result;
};

export const ContactServices = {
  createAContact,
  getFilteredContact,
  getAContact,
  updateContactResponse,
  deleteAContact,
};
