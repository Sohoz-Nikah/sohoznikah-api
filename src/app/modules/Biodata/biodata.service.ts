/* eslint-disable @typescript-eslint/no-explicit-any */
import { Biodata, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IBiodataFilterRequest } from './biodata.interface';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import { paginationHelpers } from '../../helper/paginationHelper';
import { BiodataSearchAbleFields } from './biodata.constant';

const createABiodata = async (
  req: Record<string, any>,
  creator: string,
): Promise<Biodata> => {
  console.log(req.body, creator);
  const {
    userId,
    preApprovalAcceptTerms,
    preApprovalOathTruthfulInfo,
    preApprovalOathLegalResponsibility,
    postApprovalOathTruthfulInfo,
    postApprovalOathNoMisuse,
    postApprovalOathLegalResponsibility,
    profilePic,
    primaryInfos,
    generalInfos,
    addressInfos,
    occupationInfos,
    familyInfos,
    familySiblings,
    religiousInfos,
    personalInfos,
    marriageInfos,
    spousePreferenceInfos,
    educationInfos,
    primaryInfoGuardianContacts,
  } = req.body;

  const result = await prisma.biodata.create({
    data: {
      ...(preApprovalAcceptTerms && { preApprovalAcceptTerms }),
      ...(preApprovalOathTruthfulInfo && { preApprovalOathTruthfulInfo }),
      ...(preApprovalOathLegalResponsibility && {
        preApprovalOathLegalResponsibility,
      }),
      ...(postApprovalOathTruthfulInfo && { postApprovalOathTruthfulInfo }),
      ...(postApprovalOathNoMisuse && { postApprovalOathNoMisuse }),
      ...(postApprovalOathLegalResponsibility && {
        postApprovalOathLegalResponsibility,
      }),
      ...(profilePic && { profilePic }),
      createdBy: creator,

      ...(primaryInfos && { primaryInfos: { create: primaryInfos } }),
      ...(generalInfos && { generalInfos: { create: generalInfos } }),
      ...(addressInfos && { addressInfos: { create: addressInfos } }),
      ...(educationInfos && { educationInfos: { create: educationInfos } }),
      ...(occupationInfos && { occupationInfos: { create: occupationInfos } }),
      ...(familyInfos && { familyInfos: { create: familyInfos } }),
      ...(familySiblings && { familySiblings: { create: familySiblings } }),
      ...(religiousInfos && { religiousInfos: { create: religiousInfos } }),
      ...(personalInfos && { personalInfos: { create: personalInfos } }),
      ...(marriageInfos && { marriageInfos: { create: marriageInfos } }),
      ...(spousePreferenceInfos && {
        spousePreferenceInfos: { create: spousePreferenceInfos },
      }),
      ...(primaryInfoGuardianContacts && {
        primaryInfoGuardianContacts: { create: primaryInfoGuardianContacts },
      }),
    },
  });

  return result;
};

const getFilteredBiodata = async (
  filters: IBiodataFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, statusId, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: BiodataSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (statusId) {
    andConditions.push({
      statusId: {
        equals: Number(statusId),
      },
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

  const whereConditons: Prisma.BiodataWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.biodata.findMany({
    where: whereConditons,
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

  const total = await prisma.biodata.count({
    where: whereConditons,
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

const getABiodata = async (BiodataId: string) => {
  const Biodata = await prisma.biodata.findUniqueOrThrow({
    where: {
      id: BiodataId,
    },
  });

  return Biodata;
};

const updateABiodata = async (
  BiodataId: string,
  data: Partial<Biodata>,
): Promise<Biodata> => {
  await prisma.biodata.findFirstOrThrow({
    where: {
      id: BiodataId,
    },
  });

  const result = await prisma.biodata.update({
    where: {
      id: BiodataId,
    },
    data,
  });

  return result;
};

const deleteABiodata = async (BiodataId: string): Promise<Biodata> => {
  await prisma.biodata.findFirstOrThrow({
    where: {
      id: BiodataId,
    },
  });

  const result = await prisma.biodata.delete({
    where: {
      id: BiodataId,
    },
  });

  return result;
};

export const BiodataServices = {
  createABiodata,
  getFilteredBiodata,
  getABiodata,
  updateABiodata,
  deleteABiodata,
};
