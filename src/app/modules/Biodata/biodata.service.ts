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
  const {
    userId,
    firstWordsFormData,
    primaryInfoFormData,
    generalInfoFormData,
    addressInfoFormData,
    educationInfoFormData,
    occupationInfoFormData,
    familyInfoFormData,
    religiousInfoFormData,
    personalInfoFormData,
    marriageInfoFormData,
    spousePreferenceInfoFormData,
    profilePicFormData,
    finalWordsFormData,
  } = req.body;

  const result = await prisma.$transaction(async prisma => {
    // Step 1: Create Biodata
    const biodata = await prisma.biodata.create({
      data: {
        createdBy: creator,
        userId: userId,
        ...(profilePicFormData && { profilePic: profilePicFormData.photoId }),

        ...(firstWordsFormData && {
          preApprovalAcceptTerms: firstWordsFormData.preApprovalAcceptTerms,
          preApprovalOathTruthfulInfo:
            firstWordsFormData.preApprovalOathTruthfulInfo,
          preApprovalOathLegalResponsibility:
            firstWordsFormData.preApprovalOathLegalResponsibility,
        }),

        ...(finalWordsFormData && {
          postApprovalOathTruthfulInfo:
            finalWordsFormData.postApprovalOathTruthfulInfo,
          postApprovalOathNoMisuse: finalWordsFormData.postApprovalOathNoMisuse,
          postApprovalOathLegalResponsibility:
            finalWordsFormData.postApprovalOathLegalResponsibility,
        }),
      },
    });

    const biodataId = biodata.id;

    // Step 2: Create related models

    // Primary Info
    if (primaryInfoFormData) {
      await prisma.biodataPrimaryInfo.create({
        data: {
          biodataId,
          biodataType: primaryInfoFormData.biodataType,
          biodataFor: primaryInfoFormData.biodataFor,
          fullName: primaryInfoFormData.fullName,
          fatherName: primaryInfoFormData.fatherName,
          motherName: primaryInfoFormData.motherName,
          email: primaryInfoFormData.email,
          mobile: primaryInfoFormData.mobile,
          createdBy: creator,
        },
      });

      // General Info
      if (generalInfoFormData) {
        await prisma.biodataGeneralInfo.create({
          data: {
            biodataId,
            ...generalInfoFormData,
            createdBy: creator,
          },
        });
      }

      // Guardian Contacts
      if (primaryInfoFormData.guardianContacts?.length) {
        await prisma.biodataPrimaryInfoGuardianContact.createMany({
          data: primaryInfoFormData.guardianContacts.map(contact => ({
            biodataId,
            relation: contact.relation,
            name: contact.name,
            mobile: contact.mobile,
            createdBy: creator,
          })),
        });
      }
    }

    // Address Info
    if (addressInfoFormData?.addresses?.length) {
      await prisma.biodataAddressInfo.createMany({
        data: addressInfoFormData.addresses.map(address => ({
          biodataId,
          type: address.type,
          location: address.location,
          state: address.state,
          city: address.city,
          country: address.country,
          cityzenshipStatus: address.cityzenshipStatus,
          createdBy: creator,
        })),
      });
    }

    // Education Info
    if (educationInfoFormData) {
      await prisma.biodataEducationInfo.create({
        data: {
          biodataId,
          type: educationInfoFormData.type,
          highestDegree: educationInfoFormData.highestDegree,
          religiousEducation: educationInfoFormData.religiousEducation,
          detail: educationInfoFormData.details,
          createdBy: creator,
        },
      });

      // Degrees
      if (educationInfoFormData.degrees?.length) {
        await prisma.biodataEducationInfoDegree.createMany({
          data: educationInfoFormData.degrees.map(degree => ({
            biodataId,
            degreeType: degree.degreeType,
            name: degree.name,
            passYear: degree.passYear,
            group: degree.group,
            institute: degree.institute,
            createdBy: creator,
          })),
        });
      }
    }

    // Occupation Info
    if (occupationInfoFormData) {
      await prisma.biodataOccupationInfo.create({
        data: {
          biodataId,
          ...occupationInfoFormData,
          createdBy: creator,
        },
      });
    }

    // Family Info
    if (familyInfoFormData) {
      await prisma.biodataFamilyInfo.create({
        data: {
          biodataId,
          ...familyInfoFormData,
          createdBy: creator,
        },
      });

      if (familyInfoFormData.siblings?.length) {
        await prisma.biodataFamilyInfoSibling.createMany({
          data: familyInfoFormData.siblings.map(sibling => ({
            biodataId,
            ...sibling,
            createdBy: creator,
          })),
        });
      }
    }

    // Religious Info
    if (religiousInfoFormData) {
      await prisma.biodataReligiousInfo.create({
        data: {
          biodataId,
          ...religiousInfoFormData,
          createdBy: creator,
        },
      });
    }

    // Personal Info
    if (personalInfoFormData) {
      await prisma.biodataPersonalInfo.create({
        data: {
          biodataId,
          ...personalInfoFormData,
          createdBy: creator,
        },
      });
    }

    // Marriage Info
    if (marriageInfoFormData) {
      await prisma.biodataMarriageInfo.create({
        data: {
          biodataId,
          ...marriageInfoFormData,
          createdBy: creator,
        },
      });
    }

    // Spouse Preference Info
    if (spousePreferenceInfoFormData) {
      await prisma.biodataSpousePreferenceInfo.create({
        data: {
          biodataId,
          ...spousePreferenceInfoFormData,
          createdBy: creator,
        },
      });
    }

    return biodata;
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
