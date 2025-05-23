/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Proposal } from '@prisma/client';
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
      type: 'Got New Proposal',
      message: `You have got new proposal from : ${existingUser.name}`,
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
  console.log(filters, options, userId, role);
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

  const whereConditions: Prisma.ProposalWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.proposal.findMany({
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

  const total = await prisma.proposal.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
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

// const updateProposalResponse = async (
//   proposalId: string,
//   payload: Record<string, any>,
//   user: JwtPayload,
// ) => {
//   const { userId } = user;
//   const proposal = await prisma.proposal.findUnique({
//     where: { id: proposalId, receiverId: userId },
//   });

//   if (!proposal) throw new ApiError(httpStatus.NOT_FOUND, 'Proposal not found');

//   if (response === 'NEED_TIME') {
//     return prisma.proposal.update({
//       where: { id: proposalId },
//       data: {
//         status: 'NEED_TIME',
//         expireAt: addHours(new Date(), 72),
//       },
//     });
//   }

//   return prisma.proposal.update({
//     where: { id: proposalId },
//     data: {
//       status: response,
//       respondedAt: new Date(),
//     },
//   });
// };

const deleteAProposal = async (ProposalId: string): Promise<Proposal> => {
  await prisma.proposal.findFirstOrThrow({
    where: {
      id: ProposalId,
    },
  });

  const result = await prisma.proposal.delete({
    where: {
      id: ProposalId,
    },
  });

  return result;
};

export const ProposalServices = {
  createAProposal,
  getFilteredProposal,
  getAProposal,
  // updateProposalResponse,
  deleteAProposal,
};
