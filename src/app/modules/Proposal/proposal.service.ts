/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Proposal, UserRole } from '@prisma/client';
import { addHours } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { ProposalSearchAbleFields } from './proposal.constant';
import { IProposalFilterRequest } from './proposal.interface';

const createAProposal = async (
  payload: Record<string, any>,
  user: JwtPayload,
): Promise<Proposal> => {
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

  // Check if already sent proposal
  const alreadySent = await prisma.proposal.findFirst({
    where: {
      senderId: userId,
      receiverId: existingBiodata.userId,
      biodataId,
      status: { in: ['PENDING', 'NEED_TIME'] },
    },
  });

  if (alreadySent) {
    throw new ApiError(httpStatus.CONFLICT, 'You have already sent a proposal');
  }

  if (existingUser.token < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough tokens');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { token: { decrement: 1 } },
  });

  // Create Proposal
  const newProposal = await prisma.proposal.create({
    data: {
      biodataId,
      senderId: userId,
      receiverId: existingBiodata.userId,
      expiredAt: addHours(new Date(), 72),
    },
  });

  if (!newProposal) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create proposal',
    );
  }
  // Optional: Log update
  await prisma.notification.create({
    data: {
      type: 'NEW_PROPOSAL',
      message: ` একটি নতুন প্রস্তাব এসেছে।`,
      userId: existingBiodata.userId,
      proposalId: newProposal.id,
    },
  });

  return newProposal;
};

const getFilteredProposal = async (
  filters: IProposalFilterRequest,
  options: IPaginationOptions,
  user: JwtPayload,
) => {
  const { userId, role } = user;
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, type, status, ...filterData } = filters;
  const andConditions: Prisma.ProposalWhereInput[] = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      OR: ProposalSearchAbleFields.map(field => ({
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
  if (role === UserRole.USER) {
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

  const whereConditions: Prisma.ProposalWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.proposal.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      sender: {
        include: {
          biodatas: {
            include: {
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

  const total = await prisma.proposal.count({
    where: whereConditions,
  });
  const proposalData = result.map(proposal => {
    let currentAddress;
    let permanentAddresses;
    let biodata;
    if (type === 'received') {
      currentAddress = proposal?.sender?.biodatas?.addressInfoFormData?.find(
        (item: any) => item.type === 'current_address',
      );
      permanentAddresses =
        proposal?.sender?.biodatas?.addressInfoFormData?.find(
          (item: any) => item.type === 'permanent_address',
        );
      biodata = proposal?.sender?.biodatas;
    } else if (type === 'sent') {
      currentAddress = proposal?.receiver?.biodatas?.addressInfoFormData?.find(
        (item: any) => item.type === 'current_address',
      );
      permanentAddresses =
        proposal?.receiver?.biodatas?.addressInfoFormData?.find(
          (item: any) => item.type === 'permanent_address',
        );
      biodata = proposal?.receiver?.biodatas;
    }

    return {
      id: proposal.id,
      senderId: proposal.senderId,
      receiverId: proposal.receiverId,
      biodataId: biodata?.id,
      bioNo: biodata?.code,
      bioVisibility: biodata?.visibility,
      bioPresentCity: currentAddress?.city,
      bioPresentState: currentAddress?.state,
      bioPermanentCity: permanentAddresses?.city,
      bioPermanentState: permanentAddresses?.state,
      createdAt: proposal?.createdAt,
      respondedAt: proposal?.respondedAt,
      isDeleted: proposal?.isDeleted,
      tokenSpent: proposal?.tokenSpent,
      expiredAt: proposal?.expiredAt,
      isCancelled: proposal?.isCancelled,
      status: proposal?.status,
      tokenRefunded: proposal?.tokenRefunded,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: proposalData,
  };
};

const getAProposal = async (ProposalId: string, user: JwtPayload) => {
  const { userId, role } = user;
  let result: Proposal | null = null;
  if (role === 'USER') {
    result = await prisma.proposal.findFirst({
      where: {
        id: ProposalId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
  } else {
    result = await prisma.proposal.findUnique({
      where: { id: ProposalId },
    });
  }

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');
  }

  return result;
};

const getProposalByBiodataId = async (
  viewedBiodataId: string,
  user: JwtPayload,
) => {
  const { userId } = user;
  const myBiodata = await prisma.biodata.findUnique({ where: { userId } });
  if (!myBiodata) throw new ApiError(httpStatus.BAD_REQUEST, 'No biodata');
  const viewedBiodata = await prisma.biodata.findUnique({
    where: { id: viewedBiodataId },
  });
  if (!viewedBiodata)
    throw new ApiError(httpStatus.NOT_FOUND, 'Viewed biodata not found');
  if (viewedBiodata.userId === userId) {
    return { proposal: null, direction: null };
  }
  const proposal = await prisma.proposal.findFirst({
    where: {
      OR: [
        {
          senderId: userId,
          receiverId: viewedBiodata.userId,
        },
        {
          senderId: viewedBiodata.userId,
          receiverId: userId,
        },
      ],
    },
  });

  return proposal;
};

const cancelProposal = async (proposalId: string, user: JwtPayload) => {
  const { userId, role } = user;

  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to cancel proposal',
    );
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId, senderId: userId },
  });

  if (!proposal) throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');

  if (proposal.expiredAt > new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You cannot cancel proposal before 72 hours',
    );
  }

  await prisma.notification.create({
    data: {
      type: 'PROPOSAL_CANCELLED',
      message: `আপনি রেসপন্স না করায় অপরপক্ষ প্রস্তাবটি বাতিল করেছেন।`,
      userId: proposal.receiverId,
      proposalId: proposalId,
    },
  });

  return prisma.proposal.update({
    where: { id: proposalId, senderId: userId },
    data: { isCancelled: true },
  });
};

const updateProposalResponse = async (
  proposalId: string,
  payload: Record<string, any>,
  user: JwtPayload,
) => {
  const { userId } = user;
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId, receiverId: userId },
  });

  if (!proposal) throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');

  if (payload.response === 'NEED_TIME') {
    return prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: 'NEED_TIME',
        expiredAt: addHours(new Date(), 72),
      },
    });
  }

  await prisma.notification.create({
    data: {
      type: 'PROPOSAL_RESPONSE',
      message: `অপরপক্ষ আপনার প্রস্তাবে রেসপন্স করেছেন।`,
      userId: proposal.senderId,
      proposalId: proposalId,
    },
  });

  return prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: payload.response,
      respondedAt: new Date(),
    },
  });
};

const deleteAProposal = async (
  ProposalId: string,
  user: JwtPayload,
): Promise<Proposal> => {
  const { userId, role } = user;
  const proposal = await prisma.proposal.findFirstOrThrow({
    where: {
      id: ProposalId,
    },
  });

  let result;
  if (role === UserRole.USER) {
    if (proposal.senderId !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to delete this proposal',
      );
    }

    result = await prisma.proposal.delete({
      where: {
        id: ProposalId,
        senderId: userId,
      },
    });

    return result;
  }

  // if (role === UserRole.ADMIN) {
  //   if (proposal.senderId !== userId) {
  //     throw new ApiError(
  //       httpStatus.FORBIDDEN,
  //       'You are not allowed to delete this proposal',
  //     );
  //   }
  // }

  result = await prisma.proposal.delete({
    where: {
      id: ProposalId,
    },
  });

  return result;
};

export const ProposalServices = {
  createAProposal,
  getFilteredProposal,
  getProposalByBiodataId,
  getAProposal,
  cancelProposal,
  updateProposalResponse,
  deleteAProposal,
};
