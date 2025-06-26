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

  const existingBiodata = await prisma.biodata.findUnique({
    where: { id: biodataId },
  });
  if (!existingBiodata)
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const alreadySent = await prisma.contactAccess.findFirst({
    where: {
      senderId: userId,
      receiverId: existingBiodata.userId,
      biodataId,
      contactStatus: { in: ['PENDING'] },
    },
  });
  if (alreadySent)
    throw new ApiError(
      httpStatus.CONFLICT,
      'You have already sent a Contact Request',
    );

  if (existingUser.token < 2)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough tokens');

  await prisma.user.update({
    where: { id: userId },
    data: { token: { decrement: 2 } },
  });

  const newContact = await prisma.contactAccess.create({
    data: {
      biodataId,
      senderId: userId,
      receiverId: existingBiodata.userId,
      contactExpiredAt: addHours(new Date(), 72),
    },
  });

  await prisma.notification.create({
    data: {
      type: 'CONTACT_REQUEST',
      message: ` আপনার অভিভাবকের সাথে যোগাযোগের জন্য অনুরোধ এসেছে। রেসপন্স করুন।`,
      userId: existingBiodata.userId,
      contactAccessId: newContact.id,
    },
  });

  return newContact;
};

const getContactByBiodataId = async (
  biodataId: string,
  user: JwtPayload,
  query: any,
) => {
  // const { type } = query;
  const { userId, role } = user;
  let result: ContactAccess | null = null;
  if (role === 'USER') {
    result = await prisma.contactAccess.findFirst({
      where: {
        biodataId: biodataId,
        OR: [{ senderId: userId }],
      },
    });
  }

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Donot received any contact from this biodata.',
    );
  }

  const fullName = await prisma.biodataPrimaryInfo.findUnique({
    where: {
      biodataId: result.biodataId,
    },
    select: {
      fullName: true,
    },
  });

  const contactData = await prisma.biodataPrimaryInfoGuardianContact.findMany({
    where: {
      biodataId: result.biodataId,
    },
    select: {
      id: true,
      relation: true,
      phoneNumber: true,
    },
  });

  const biodataContact = {
    id: result.id,
    biodataId: result.biodataId,
    senderId: result.senderId,
    receiverId: result.receiverId,
    contactStatus: result.contactStatus,
    contactExpiredAt: result.contactExpiredAt,
    createdAt: result.createdAt,
    respondedAt: result.respondedAt,
    isDeleted: result.isDeleted,
    tokenSpent: result.tokenSpent,
    tokenRefunded: result.tokenRefunded,
    fullName: fullName?.fullName,
    contacts:
      result.contactStatus === ContactStatus.ACCEPTED ? contactData : [],
  };

  return biodataContact;
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

  // Role-based access filtering
  if (role === UserRole.USER) {
    if (type === 'sent') {
      andConditions.push({
        senderId: userId,
        contactStatus: { in: [ContactStatus.ACCEPTED] },
      });
    } else if (type === 'received') {
      andConditions.push({
        receiverId: userId,
        contactStatus: { in: [ContactStatus.ACCEPTED] },
      });
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
      sender: {
        include: {
          biodatas: {
            include: {
              primaryInfoFormData: true,
              addressInfoFormData: true,
              guardianContacts: true,
            },
          }, //
        },
      },
      receiver: {
        include: {
          biodatas: {
            include: {
              primaryInfoFormData: true,
              addressInfoFormData: true,
              guardianContacts: true,
            },
          }, //
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

  // console.log(result);

  const total = await prisma.contactAccess.count({
    where: whereConditions,
  });

  const ContactData = result.map(Contact => {
    let currentAddress;
    let permanentAddresses;
    let contactData;
    let biodata;
    if (type === 'received') {
      currentAddress = Contact?.sender?.biodatas?.addressInfoFormData?.find(
        (item: any) => item.type === 'current_address',
      );
      permanentAddresses = Contact?.sender?.biodatas?.addressInfoFormData?.find(
        (item: any) => item.type === 'permanent_address',
      );
      contactData = Contact?.sender?.biodatas?.guardianContacts;
      biodata = Contact?.sender?.biodatas;
    } else if (type === 'sent') {
      currentAddress = Contact?.receiver?.biodatas?.addressInfoFormData?.find(
        (item: any) => item.type === 'current_address',
      );
      permanentAddresses =
        Contact?.receiver?.biodatas?.addressInfoFormData?.find(
          (item: any) => item.type === 'permanent_address',
        );
      contactData = Contact?.receiver?.biodatas?.guardianContacts;
      biodata = Contact?.receiver?.biodatas;
    }

    return {
      id: Contact.id,
      senderId: Contact.senderId,
      receiverId: Contact.receiverId,
      biodataId: biodata?.id,
      bioNo: biodata?.code,
      bioVisibility: biodata?.visibility,
      bioPresentCity: currentAddress?.city,
      bioPresentState: currentAddress?.state,
      bioPermanentCity: permanentAddresses?.city,
      bioPermanentState: permanentAddresses?.state,
      fullName: biodata?.primaryInfoFormData?.fullName,
      createdAt: Contact?.createdAt,
      respondedAt: Contact?.respondedAt,
      isDeleted: Contact?.isDeleted,
      tokenSpent: Contact?.tokenSpent,
      contactExpiredAt: Contact?.contactExpiredAt,
      contactStatus: Contact?.contactStatus,
      tokenRefunded: Contact?.tokenRefunded,
      contacts:
        Contact?.contactStatus === ContactStatus.ACCEPTED ? contactData : [],
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

const getMyContact = async (user: JwtPayload) => {
  const { userId } = user;

  const result = await prisma.contactAccess.findMany({
    where: { receiverId: userId },
  });
  return result;
};

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

  let result;

  if (payload.response === 'YES') {
    result = await prisma.contactAccess.update({
      where: { id: ContactId },
      data: {
        contactStatus: ContactStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });
  } else if (payload.response === 'NO') {
    result = await prisma.contactAccess.update({
      where: { id: ContactId },
      data: {
        contactStatus: ContactStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: Contact.senderId },
      data: {
        token: { increment: 2 },
      },
    });
  }

  await prisma.notification.create({
    data: {
      type: `${payload.response === 'YES' ? 'CONTACT_ACCEPTED' : 'CONTACT_REJECTED'}`,
      message: `${payload.response === 'YES' ? 'অপরপক্ষ যোগাযোগের অনুরোধ গ্রহণ করেছেন। যোগাযোগ নম্বর দেখুন। ' : 'অপরপক্ষ যোগাযোগের অনুরোধ প্রত্যাখ্যান করেছেন এবং আপনি ২টি টোকেন রিফান্ড পেয়েছেন। '}`,
      userId: Contact.senderId,
      contactAccessId: ContactId,
    },
  });

  return result;
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

// New function to check and cancel expired requests
const checkAndCancelExpiredRequests = async () => {
  try {
    const now = new Date();
    // Find all pending requests where contactExpiredAt is in the past
    const expiredRequests = await prisma.contactAccess.findMany({
      where: {
        contactStatus: 'PENDING',
        contactExpiredAt: {
          lte: now,
        },
      },
    });

    // Process each expired request
    const updatePromises = expiredRequests.map(async request => {
      // Create a notification for the sender
      await prisma.notification.create({
        data: {
          type: 'CONTACT_AUTO_CANCELLED',
          message: `৭২ ঘন্টা অতিক্রম হওয়ায় যোগাযোগের অনুরোধটি বাতিল হয়েছে এবং ২টি টোকেন রিফান্ড পেয়েছেন।
। চাইলে আবার অনুরোধ পাঠাতে পারেন।`,
          userId: request.senderId,
          contactAccessId: request.id,
        },
      });

      // Update status to REJECTED and mark tokens as refunded
      await prisma.contactAccess.delete({
        where: { id: request.id },
      });

      // Refund 2 tokens to the sender
      await prisma.user.update({
        where: { id: request.senderId },
        data: {
          token: {
            increment: 2,
          },
        },
      });
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error in checkAndCancelExpiredRequests:', error);
  }
};

export const ContactServices = {
  createAContact,
  getFilteredContact,
  getContactByBiodataId,
  getAContact,
  updateContactResponse,
  deleteAContact,
  checkAndCancelExpiredRequests,
  getMyContact,
};
