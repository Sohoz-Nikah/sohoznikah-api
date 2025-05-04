/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Biodata,
  BiodataStatus,
  BioDataType,
  Prisma,
  VisibilityStatus,
} from '@prisma/client';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import { buildFilterConditions } from '../../utils/buildFilterConditions';
import generateUniqueCode from '../../utils/generateUniqueCode';
import { BiodataSearchAbleFields, relationFieldMap } from './biodata.constant';
import { IBiodataFilterRequest } from './biodata.interface';

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
    let generatedId;
    if (primaryInfoFormData?.biodataType === BioDataType.GROOM) {
      generatedId = await generateUniqueCode({
        prefix: 'M',
        model: 'biodata',
        biodataType: BioDataType.GROOM,
      });
    } else if (primaryInfoFormData?.biodataType === BioDataType.BRIDE) {
      generatedId = await generateUniqueCode({
        prefix: 'F',
        model: 'biodata',
        biodataType: BioDataType.BRIDE,
      });
    }

    // Step 1: Create Biodata
    const biodata = await prisma.biodata.create({
      data: {
        createdBy: creator,
        code: generatedId,
        biodataType: primaryInfoFormData?.biodataType,

        userId: userId,

        ...(firstWordsFormData && {
          preApprovalAcceptTerms: firstWordsFormData?.preApprovalAcceptTerms,
          preApprovalOathTruthfulInfo:
            firstWordsFormData?.preApprovalOathTruthfulInfo,
          preApprovalOathLegalResponsibility:
            firstWordsFormData?.preApprovalOathLegalResponsibility,
        }),

        ...(finalWordsFormData && {
          postApprovalOathTruthfulInfo:
            finalWordsFormData?.postApprovalOathTruthfulInfo,
          postApprovalOathNoMisuse:
            finalWordsFormData?.postApprovalOathNoMisuse,
          postApprovalOathLegalResponsibility:
            finalWordsFormData?.postApprovalOathLegalResponsibility,
        }),

        ...(profilePicFormData && {
          profilePic: profilePicFormData?.photoId,
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
          biodataType: primaryInfoFormData?.biodataType,
          biodataFor: primaryInfoFormData?.biodataFor,
          fullName: primaryInfoFormData?.fullName,
          fatherName: primaryInfoFormData?.fatherName,
          motherName: primaryInfoFormData?.motherName,
          email: primaryInfoFormData?.email,
          mobile: primaryInfoFormData?.mobile,
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
          data: primaryInfoFormData.guardianContacts.map(
            (contact: { relation: string; name: string; mobile: string }) => ({
              biodataId,
              relation: contact.relation,
              name: contact.name,
              mobile: contact.mobile,
              createdBy: creator,
            }),
          ),
        });
      }
    }

    // Address Info
    if (addressInfoFormData?.addresses?.length) {
      await prisma.biodataAddressInfo.createMany({
        data: addressInfoFormData.addresses.map(
          (address: {
            type: string;
            location: string;
            state: string;
            city: string;
            country: string;
            cityzenshipStatus: string;
          }) => ({
            biodataId,
            type: address?.type,
            location: address?.location,
            state: address?.state,
            city: address?.city,
            country: address?.country,
            cityzenshipStatus: address?.cityzenshipStatus,
            createdBy: creator,
          }),
        ),
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
          data: educationInfoFormData.degrees.map(
            (degree: {
              degreeType: string;
              name: string;
              passYear: string;
              group: string;
              institute: string;
            }) => ({
              biodataId,
              degreeType: degree.degreeType,
              name: degree.name,
              passYear: degree.passYear,
              group: degree.group,
              institute: degree.institute,
              createdBy: creator,
            }),
          ),
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
          parentsAlive: familyInfoFormData?.parentsAlive,
          fatherOccupation: familyInfoFormData?.fatherOccupation,
          motherOccupation: familyInfoFormData?.motherOccupation,
          fatherSideDetail: familyInfoFormData?.fatherSideDetail,
          motherSideDetail: familyInfoFormData?.motherSideDetail,
          familyType: familyInfoFormData?.familyType,
          familyBackground: familyInfoFormData?.familyBackground,
          livingCondition: familyInfoFormData?.livingCondition,
          wealthDescription: familyInfoFormData?.wealthDescription,
          createdBy: creator,
        },
      });

      if (familyInfoFormData.siblings?.length) {
        await prisma.biodataFamilyInfoSibling.createMany({
          data: familyInfoFormData.siblings.map(
            (sibling: {
              type?: string;
              occupation?: string;
              maritalStatus?: string;
              children?: string;
            }) => ({
              biodataId,
              ...sibling,
              createdBy: creator,
            }),
          ),
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

    // Notify admin
    await prisma.notification.create({
      data: {
        type: 'NEW_BIODATA',
        message: `A new biodata has been submitted by user ID: ${creator}`,
        userId: creator,
        biodataId: biodata.id,
        isGlobal: false,
      },
    });
    return biodata;
  });

  return result;
};

const getFilteredBiodata = async (
  filters: IBiodataFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: any[] = [];

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

  andConditions.push({
    status: {
      equals: BiodataStatus.APPROVED,
    },
    visibility: {
      equals: VisibilityStatus.PUBLIC,
    },
  });

  const filterConditions = buildFilterConditions(filterData, relationFieldMap);
  if (Object.keys(filterConditions).length)
    andConditions.push(filterConditions);

  const whereConditions: Prisma.BiodataWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.biodata.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      primaryInfos: true, // optional if you need related data in response
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { id: 'desc' },
  });

  const total = await prisma.biodata.count({
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

const getABiodata = async (BiodataId: string) => {
  const Biodata = await prisma.biodata.findUniqueOrThrow({
    where: {
      id: BiodataId,
      status: BiodataStatus.APPROVED,
      visibility: VisibilityStatus.PUBLIC,
    },
  });

  return Biodata;
};

const updateABiodata = async (
  biodataId: string,
  payload: Record<string, any>,
  updater: string,
): Promise<Biodata> => {
  console.log(biodataId, payload, updater);
  // Validate Biodata ID
  await prisma.biodata.findFirstOrThrow({
    where: {
      id: biodataId,
      status: BiodataStatus.APPROVED,
      visibility: VisibilityStatus.PUBLIC,
    },
  });
  // Extract data from request
  const {
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
  } = payload;

  const result = await prisma.$transaction(async prisma => {
    // Step 1: Update main biodata
    await prisma.biodata.update({
      where: { id: biodataId },
      data: {
        ...(profilePicFormData && {
          profilePic: profilePicFormData?.photoId,
        }),
        ...(firstWordsFormData && {
          preApprovalAcceptTerms: firstWordsFormData?.preApprovalAcceptTerms,
          preApprovalOathTruthfulInfo:
            firstWordsFormData?.preApprovalOathTruthfulInfo,
          preApprovalOathLegalResponsibility:
            firstWordsFormData?.preApprovalOathLegalResponsibility,
        }),
        ...(finalWordsFormData && {
          postApprovalOathTruthfulInfo:
            finalWordsFormData?.postApprovalOathTruthfulInfo,
          postApprovalOathNoMisuse:
            finalWordsFormData?.postApprovalOathNoMisuse,
          postApprovalOathLegalResponsibility:
            finalWordsFormData?.postApprovalOathLegalResponsibility,
        }),
      },
    });

    // Step 2: Upsert/update related fields
    if (primaryInfoFormData) {
      await prisma.biodataPrimaryInfo.upsert({
        where: { biodataId },
        update: {
          ...primaryInfoFormData,
          updatedBy: updater,
        },
      });

      // Delete old guardian contacts and recreate
      await prisma.biodataPrimaryInfoGuardianContact.deleteMany({
        where: { biodataId },
      });
      if (primaryInfoFormData.guardianContacts?.length) {
        await prisma.biodataPrimaryInfoGuardianContact.createMany({
          data: primaryInfoFormData.guardianContacts.map(contact => ({
            biodataId,
            ...contact,
            createdBy: updater,
          })),
        });
      }
    }

    if (generalInfoFormData) {
      await prisma.biodataGeneralInfo.upsert({
        where: { biodataId },
        update: { ...generalInfoFormData, updatedBy: updater },
        // create: { biodataId, ...generalInfoFormData, createdBy: updater },
      });
    }

    if (addressInfoFormData?.addresses?.length) {
      await prisma.biodataAddressInfo.deleteMany({ where: { biodataId } });
      await prisma.biodataAddressInfo.createMany({
        data: addressInfoFormData.addresses.map(address => ({
          biodataId,
          ...address,
          createdBy: updater,
        })),
      });
    }

    if (educationInfoFormData) {
      await prisma.biodataEducationInfo.upsert({
        where: { biodataId },
        update: {
          type: educationInfoFormData.type,
          highestDegree: educationInfoFormData.highestDegree,
          religiousEducation: educationInfoFormData.religiousEducation,
          detail: educationInfoFormData.details,
          updatedBy: updater,
        },
        create: {
          biodataId,
          type: educationInfoFormData.type,
          highestDegree: educationInfoFormData.highestDegree,
          religiousEducation: educationInfoFormData.religiousEducation,
          detail: educationInfoFormData.details,
          createdBy: updater,
        },
      });

      if (educationInfoFormData.degrees?.length) {
        await prisma.biodataEducationInfoDegree.deleteMany({
          where: { biodataId },
        });
        await prisma.biodataEducationInfoDegree.createMany({
          data: educationInfoFormData.degrees.map(degree => ({
            biodataId,
            ...degree,
            createdBy: updater,
          })),
        });
      }
    }

    if (occupationInfoFormData) {
      await prisma.biodataOccupationInfo.upsert({
        where: { biodataId },
        update: { ...occupationInfoFormData, updatedBy: updater },
        create: { biodataId, ...occupationInfoFormData, createdBy: updater },
      });
    }

    if (familyInfoFormData) {
      await prisma.biodataFamilyInfo.upsert({
        where: { biodataId },
        update: { ...familyInfoFormData, updatedBy: updater },
        create: { biodataId, ...familyInfoFormData, createdBy: updater },
      });

      if (familyInfoFormData.siblings?.length) {
        await prisma.biodataFamilyInfoSibling.deleteMany({
          where: { biodataId },
        });
        await prisma.biodataFamilyInfoSibling.createMany({
          data: familyInfoFormData.siblings.map(sibling => ({
            biodataId,
            ...sibling,
            createdBy: updater,
          })),
        });
      }
    }

    if (religiousInfoFormData) {
      await prisma.biodataReligiousInfo.upsert({
        where: { biodataId },
        update: { ...religiousInfoFormData, updatedBy: updater },
        create: { biodataId, ...religiousInfoFormData, createdBy: updater },
      });
    }

    if (personalInfoFormData) {
      await prisma.biodataPersonalInfo.upsert({
        where: { biodataId },
        update: { ...personalInfoFormData, updatedBy: updater },
        create: { biodataId, ...personalInfoFormData, createdBy: updater },
      });
    }

    if (marriageInfoFormData) {
      await prisma.biodataMarriageInfo.upsert({
        where: { biodataId },
        update: { ...marriageInfoFormData, updatedBy: updater },
        create: { biodataId, ...marriageInfoFormData, createdBy: updater },
      });
    }

    if (spousePreferenceInfoFormData) {
      await prisma.biodataSpousePreferenceInfo.upsert({
        where: { biodataId },
        update: { ...spousePreferenceInfoFormData, updatedBy: updater },
        create: {
          biodataId,
          ...spousePreferenceInfoFormData,
          createdBy: updater,
        },
      });
    }

    // Optional: Log update
    await prisma.notification.create({
      data: {
        type: 'UPDATE_BIODATA',
        message: `Biodata updated by user ID: ${updater}`,
        userId: updater,
        biodataId,
        isGlobal: false,
      },
    });

    return await prisma.biodata.findUnique({ where: { id: biodataId } });
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
