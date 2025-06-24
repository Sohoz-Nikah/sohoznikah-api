/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Biodata,
  BiodataStatus,
  BioDataType,
  Prisma,
  UserRole,
  VisibilityStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/iPaginationOptions';
import prisma from '../../shared/prisma';
import {
  buildFilterConditions,
  RelationMap,
} from '../../utils/buildFilterConditions';
import { buildRangeConditions } from '../../utils/buildRangeCondition';
import generateUniqueCode from '../../utils/generateUniqueCode';
import {
  BiodataSearchAbleFields,
  rangeConfigs,
  relationFieldMap,
} from './biodata.constant';
import { BiodataFormData, IBiodataFilterRequest } from './biodata.interface';

// Helper function to handle biodata creation/update
async function handleBiodataOperation(
  biodataId: string | null,
  formData: BiodataFormData & { visibility?: string },
  userId: string,
  isAdmin: boolean = false,
): Promise<Biodata> {
  console.log('formData', formData);
  return await prisma.$transaction(async tx => {
    let biodata: Biodata;

    if (!biodataId) {
      biodata = await tx.biodata.create({
        data: {
          createdBy: userId,
          createdAt: new Date(),
          userId,
        },
      });
    } else {
      biodata = await tx.biodata.update({
        where: { id: biodataId },
        data: {
          updatedBy: userId,
          updatedAt: new Date(),
        },
      });
    }
    if (formData?.visibility) {
      await tx.biodata.update({
        where: { id: biodata?.id },
        data: {
          visibility: formData.visibility as VisibilityStatus,
        },
      });
    }
    // Handle related records
    await handleRelatedRecords(
      tx,
      biodata.id,
      formData,
      userId,
      biodata.status,
    );

    // await tx.notification.create({
    //   data: {
    //     type: biodataId ? 'UPDATE_BIODATA' : 'NEW_BIODATA',
    //     message: `Biodata ${biodataId ? 'updated' : 'created'} by user ID: ${userId}`,
    //     userId,
    //     biodataId: biodata.id,
    //     isGlobal: false,
    //   },
    // });

    return biodata;
  });
}

// Helper function to handle related records with minimal database calls
async function handleRelatedRecords(
  tx: Prisma.TransactionClient,
  biodataId: string,
  formData: BiodataFormData,
  userId: string,
  status: BiodataStatus,
) {
  const {
    firstWordsFormData,
    primaryInfoFormData,
    profilePicFormData,
    finalWordsFormData,
    generalInfoFormData,
    addressInfoFormData,
    educationInfoFormData,
    occupationInfoFormData,
    familyInfoFormData,
    religiousInfoFormData,
    personalInfoFormData,
    marriageInfoFormData,
    spousePreferenceInfoFormData,
  } = formData;
  // const { guardianContacts } = primaryInfoFormData || {};

  // console.log({
  //   firstWordsFormData,
  //   primaryInfoFormData,
  //   guardianContacts,
  //   profilePicFormData,
  //   finalWordsFormData,
  //   generalInfoFormData,
  //   addressInfoFormData,
  //   educationInfoFormData,
  //   occupationInfoFormData,
  //   familyInfoFormData,
  //   religiousInfoFormData,
  //   personalInfoFormData,
  //   marriageInfoFormData,
  //   spousePreferenceInfoFormData,
  // });

  // Update biodata-level fields  2%
  if (firstWordsFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: { ...firstWordsFormData },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 2,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // 2%
  if (profilePicFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: { profilePic: profilePicFormData.photoId },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 2,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // 2%
  if (finalWordsFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: {
        ...finalWordsFormData,
        visibility: finalWordsFormData.visibility as VisibilityStatus,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 2,
          },
          status: BiodataStatus.PENDING,
        },
      });
      await prisma.notification.create({
        data: {
          type: 'NEW_BIODATA',
          adminMessage: `A New Biodata has been created and is waiting for approval.`,
          userId,
          biodataId: biodataId,
          isAdmin: true,
        },
      });
    } else if (status === BiodataStatus.UPDATE_REQUESTED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.EDIT_PENDING,
        },
      });
      await prisma.notification.create({
        data: {
          type: 'UPDATE_BIODATA',
          adminMessage: `A Biodata has been updated and is waiting for approval.`,
          userId,
          biodataId: biodataId,
          isAdmin: true,
        },
      });
    }
  }

  // Handle Primary Info (Single Record) 10%
  if (primaryInfoFormData) {
    let existingBiodata = await tx.biodata.findUnique({
      where: { id: biodataId },
    });
    if (
      existingBiodata?.biodataType !== primaryInfoFormData.biodataType ||
      !existingBiodata.code
    ) {
      let generatedId;
      if (primaryInfoFormData.biodataType === BioDataType.GROOM) {
        generatedId = await generateUniqueCode({
          prefix: 'M',
          model: 'biodata',
          biodataType: BioDataType.GROOM,
        });
      } else if (primaryInfoFormData.biodataType === BioDataType.BRIDE) {
        generatedId = await generateUniqueCode({
          prefix: 'F',
          model: 'biodata',
          biodataType: BioDataType.BRIDE,
        });
      }
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataType: primaryInfoFormData.biodataType,
          code: generatedId,
        },
      });
    }

    const { guardianContacts, ...primaryInfoData } = primaryInfoFormData;
    await tx.biodataPrimaryInfo.upsert({
      where: { biodataId },
      update: {
        ...primaryInfoData,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        ...primaryInfoData,
        createdBy: userId,
      },
    });

    // Handle Guardian Contacts (Multiple Records)
    if (guardianContacts?.length) {
      await tx.biodataPrimaryInfoGuardianContact.deleteMany({
        where: { biodataId },
      });
      await tx.biodataPrimaryInfoGuardianContact.createMany({
        data: guardianContacts.map(contact => ({
          biodataId,
          relation: contact.relation,
          fullName: contact.fullName,
          phoneNumber: contact.phoneNumber,
          createdBy: userId,
        })),
      });
    } else {
      // Optionally clear guardian contacts if none provided
      await tx.biodataPrimaryInfoGuardianContact.deleteMany({
        where: { biodataId },
      });
    }

    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle General Info (Single Record) 10%
  if (generalInfoFormData) {
    const {
      dateOfBirth,
      maritalStatus,
      skinTone,
      height,
      weight,
      bloodGroup,
      nationality,
    } = generalInfoFormData;
    await tx.biodataGeneralInfo.upsert({
      where: { biodataId },
      update: {
        dateOfBirth,
        maritalStatus,
        skinTone,
        height,
        weight,
        bloodGroup,
        nationality,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        dateOfBirth,
        maritalStatus,
        skinTone,
        height,
        weight,
        bloodGroup,
        nationality,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Address Info (Multiple Records) 10%
  if (addressInfoFormData && addressInfoFormData?.addresses?.length > 0) {
    await tx.biodataAddressInfo.deleteMany({ where: { biodataId } });
    await tx.biodataAddressInfo.createMany({
      data: addressInfoFormData.addresses.map(address => ({
        biodataId,
        type: address.type,
        location: address.location,
        state: address.state,
        city: address.city,
        country: address.country,
        permanentHomeAddress: address.permanentHomeAddress,
        cityzenshipStatus: address.cityzenshipStatus,
        detail: address.detail,
        createdBy: userId,
      })),
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Education Info (Single Record) 10%
  if (educationInfoFormData) {
    const { type, highestDegree, religiousEducation, detail, degrees } =
      educationInfoFormData;
    await tx.biodataEducationInfo.upsert({
      where: { biodataId },
      update: {
        type: type as any,
        highestDegree,
        religiousEducation,
        detail,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        type: type as any,
        highestDegree,
        religiousEducation,
        detail,
        createdBy: userId,
      },
    });

    // Handle Education Degrees (Multiple Records)
    if (degrees?.length) {
      await tx.biodataEducationInfoDegree.deleteMany({ where: { biodataId } });
      await tx.biodataEducationInfoDegree.createMany({
        data: degrees.map(degree => ({
          biodataId,
          degreeType: degree.degreeType,
          name: degree.name,
          passYear: degree.passYear,
          group: degree.group,
          institute: degree.institute,
          createdBy: userId,
        })),
      });
    }

    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Occupation Info (Single Record) 10%
  if (occupationInfoFormData) {
    const { detail, occupations, monthlyIncome } = occupationInfoFormData;
    await tx.biodataOccupationInfo.upsert({
      where: { biodataId },
      update: {
        detail,
        occupations,
        monthlyIncome,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        detail,
        occupations,
        monthlyIncome,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Family Info (Single Record) 10%
  if (familyInfoFormData) {
    const {
      parentsAlive,
      fatherOccupation,
      motherOccupation,
      fatherSideDetail,
      motherSideDetail,
      familyType,
      familyBackground,
      livingCondition,
      wealthDescription,
      siblings,
    } = familyInfoFormData;
    await tx.biodataFamilyInfo.upsert({
      where: { biodataId },
      update: {
        parentsAlive,
        fatherOccupation,
        motherOccupation,
        fatherSideDetail,
        motherSideDetail,
        familyType,
        familyBackground,
        livingCondition,
        wealthDescription,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        parentsAlive,
        fatherOccupation,
        motherOccupation,
        fatherSideDetail,
        motherSideDetail,
        familyType,
        familyBackground,
        livingCondition,
        wealthDescription,
        createdBy: userId,
      },
    });

    // Handle Family Siblings (Multiple Records)
    if (siblings?.length) {
      await tx.biodataFamilyInfoSibling.deleteMany({ where: { biodataId } });
      await tx.biodataFamilyInfoSibling.createMany({
        data: siblings.map(sibling => ({
          biodataId,
          serial: sibling.serial,
          type: sibling.type,
          occupation: sibling.occupation,
          maritalStatus: sibling.maritalStatus,
          children: sibling.children,
          createdBy: userId,
        })),
      });
    } else {
      await tx.biodataFamilyInfoSibling.deleteMany({ where: { biodataId } });
    }
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Religious Info (Single Record) 10%
  if (religiousInfoFormData) {
    const {
      type,
      ideology,
      madhab,
      praysFiveTimes,
      hasQazaPrayers,
      canReciteQuranProperly,
      avoidsHaramIncome,
      modestDressing,
      followsMahramRules,
      beliefAboutPirMurshidAndMazar,
      practicingSince,
    } = religiousInfoFormData;
    await tx.biodataReligiousInfo.upsert({
      where: { biodataId },
      update: {
        type,
        ideology,
        madhab,
        praysFiveTimes,
        hasQazaPrayers,
        canReciteQuranProperly,
        avoidsHaramIncome,
        modestDressing,
        followsMahramRules,
        beliefAboutPirMurshidAndMazar,
        practicingSince,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        type,
        ideology,
        madhab,
        praysFiveTimes,
        hasQazaPrayers,
        canReciteQuranProperly,
        avoidsHaramIncome,
        modestDressing,
        followsMahramRules,
        beliefAboutPirMurshidAndMazar,
        practicingSince,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 10,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Personal Info (Single Record) 8%
  if (personalInfoFormData) {
    const {
      beardStatus,
      preferredOutfit,
      entertainmentPreferences,
      healthConditions,
      personalTraits,
      genderEqualityView,
      lgbtqOpinion,
      specialConditions,
      aboutYourself,
    } = personalInfoFormData;
    await tx.biodataPersonalInfo.upsert({
      where: { biodataId },
      update: {
        beardStatus,
        preferredOutfit,
        entertainmentPreferences,
        healthConditions,
        personalTraits,
        genderEqualityView,
        lgbtqOpinion,
        specialConditions,
        aboutYourself,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        beardStatus,
        preferredOutfit,
        entertainmentPreferences,
        healthConditions,
        personalTraits,
        genderEqualityView,
        lgbtqOpinion,
        specialConditions,
        aboutYourself,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 8,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Marriage Info (Single Record) 8%
  if (marriageInfoFormData) {
    const {
      reasonForRemarriage,
      currentSpouseAndChildren,
      previousMarriageAndDivorceDetails,
      spouseDeathDetails,
      childrenDetails,
      guardianApproval,
      continueStudy,
      continueStudyDetails,
      careerPlan,
      careerPlanDetails,
      residence,
      arrangeHijab,
      dowryExpectation,
      allowShowingPhotoOnline,
      additionalMarriageInfo,
    } = marriageInfoFormData;
    await tx.biodataMarriageInfo.upsert({
      where: { biodataId },
      update: {
        reasonForRemarriage,
        currentSpouseAndChildren,
        previousMarriageAndDivorceDetails,
        spouseDeathDetails,
        childrenDetails,
        guardianApproval,
        continueStudy,
        continueStudyDetails,
        careerPlan,
        careerPlanDetails,
        residence,
        arrangeHijab,
        dowryExpectation,
        allowShowingPhotoOnline,
        additionalMarriageInfo,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        reasonForRemarriage,
        currentSpouseAndChildren,
        previousMarriageAndDivorceDetails,
        spouseDeathDetails,
        childrenDetails,
        guardianApproval,
        continueStudy,
        continueStudyDetails,
        careerPlan,
        careerPlanDetails,
        residence,
        arrangeHijab,
        dowryExpectation,
        allowShowingPhotoOnline,
        additionalMarriageInfo,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 8,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }

  // Handle Spouse Preference Info (Single Record) 8%
  if (spousePreferenceInfoFormData) {
    const {
      age,
      skinTone,
      height,
      educationalQualification,
      religiousEducationalQualification,
      address,
      maritalStatus,
      specialCategory,
      religiousType,
      occupation,
      familyBackground,
      blackSkinInterest,
      secondMarrige,
      location,
      qualities,
    } = spousePreferenceInfoFormData;
    await tx.biodataSpousePreferenceInfo.upsert({
      where: { biodataId },
      update: {
        age,
        skinTone,
        height,
        educationalQualification,
        religiousEducationalQualification,
        address,
        maritalStatus,
        specialCategory,
        religiousType,
        occupation,
        familyBackground,
        blackSkinInterest,
        secondMarrige,
        location,
        qualities,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        age,
        skinTone,
        height,
        educationalQualification,
        religiousEducationalQualification,
        address,
        maritalStatus,
        specialCategory,
        religiousType,
        occupation,
        familyBackground,
        blackSkinInterest,
        secondMarrige,
        location,
        qualities,
        createdBy: userId,
      },
    });
    if (status === BiodataStatus.PROCESSING) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          biodataCompleted: {
            increment: 8,
          },
        },
      });
    } else if (status === BiodataStatus.APPROVED) {
      await tx.biodata.update({
        where: { id: biodataId },
        data: {
          status: BiodataStatus.UPDATE_REQUESTED,
        },
      });
    }
  }
}

const createABiodata = async (
  req: Record<string, any>,
  creator: string,
): Promise<Biodata> => {
  return handleBiodataOperation(null, req.body, creator);
};

const getFilteredBiodata = async (
  filters: IBiodataFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  // 1) extract special keys:
  const {
    ageMin,
    ageMax,
    heightMin,
    heightMax,
    currentState,
    searchTerm,
    ...restFilters
  } = filters;

  // 2) base AND:
  const and: Prisma.BiodataWhereInput[] = [
    { status: { equals: BiodataStatus.APPROVED } },
    { visibility: { equals: VisibilityStatus.PUBLIC } },
  ];

  // 3) searchTerm:
  if (searchTerm) {
    and.push({
      OR: BiodataSearchAbleFields.map(f => ({
        [f]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // 4) numeric ranges:
  const rangeClauses = buildRangeConditions(filters, rangeConfigs);
  // console.log('rangeClauses', rangeClauses);
  and.push(...rangeClauses);

  // 5) the rest of your filters:
  const filterConditions = buildFilterConditions(
    restFilters,
    relationFieldMap as unknown as RelationMap,
  );
  if (Object.keys(filterConditions).length) {
    and.push(filterConditions);
  }

  // 6) final where:
  const where: Prisma.BiodataWhereInput = and.length ? { AND: and } : {};

  // 8) query + count:
  const [rows, filteredRows] = await Promise.all([
    prisma.biodata.findMany({
      where,
      skip,
      take: limit,
      include: {
        primaryInfoFormData: true,
        generalInfoFormData: true,
        addressInfoFormData: true,
        educationInfoFormData: true,
        occupationInfoFormData: true,
        familyInfoFormData: true,
        religiousInfoFormData: true,
        personalInfoFormData: true,
        favouriteBiodata: true,
      },
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { id: 'desc' },
    }),
    prisma.biodata.findMany({
      where,
      select: { id: true }, // Select only the id to minimize data transfer
    }),
  ]);

  const total = filteredRows.length;

  // 9) map to DTO:
  const data = rows.map(b => ({
    id: b.id,
    code: b.code,
    biodataType: b.primaryInfoFormData?.biodataType ?? null,
    fullName: b.primaryInfoFormData?.fullName ?? null,
    birthYear: b.generalInfoFormData?.dateOfBirth ?? null,
    maritalStatus: b.generalInfoFormData?.maritalStatus ?? null,
    height: b.generalInfoFormData?.height ?? null,
    permanentAddress:
      b.addressInfoFormData.find(a => a.type === 'permanent_address')
        ?.location === 'bangladesh'
        ? b.addressInfoFormData.find(a => a.type === 'permanent_address')
            ?.state +
          ', ' +
          b.addressInfoFormData.find(a => a.type === 'permanent_address')?.city
        : b.addressInfoFormData.find(a => a.type === 'permanent_address')
            ?.location,
    occupation: b.occupationInfoFormData?.occupations,
    profilePic: b.profilePic,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));

  return {
    meta: { page, limit, total },
    data,
  };
};

const getAllBiodata = async (
  filters: IBiodataFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, status } = filters;
  console.log('filters', filters);
  const and: Prisma.BiodataWhereInput[] = [];

  if (searchTerm) {
    and.push({
      OR: BiodataSearchAbleFields.map(f => ({
        [f]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (status) {
    and.push({
      status: { equals: status },
    });
  }

  const where: Prisma.BiodataWhereInput = and.length ? { AND: and } : {};

  const biodata = await prisma.biodata.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { updatedAt: 'desc' },
  });
  const total = await prisma.biodata.count({ where });

  return {
    meta: { page, limit, total },
    data: biodata,
  };
};

const getABiodata = async (biodataId: string) => {
  const biodata = await prisma.biodata.findFirst({
    where: {
      id: biodataId,
      status: BiodataStatus.APPROVED,
      visibility: VisibilityStatus.PUBLIC,
    },
    include: {
      primaryInfoFormData: true,
      generalInfoFormData: true,
      addressInfoFormData: true,
      educationInfoFormData: true,
      educationDegrees: true,
      occupationInfoFormData: true,
      familyInfoFormData: true,
      familySiblings: true,
      religiousInfoFormData: true,
      personalInfoFormData: true,
      marriageInfoFormData: true,
      spousePreferenceInfoFormData: true,
      // guardianContacts: true,
    },
  });
  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }
  await prisma.biodata.update({
    where: { id: biodataId },
    data: {
      totalViews: { increment: 1 },
    },
  });
  // console.log('biodata', biodata);
  return biodata;
};

const getMyBiodata = async (userId: string) => {
  const biodata = await prisma.biodata.findFirst({
    where: { userId },
    include: {
      primaryInfoFormData: true,
      generalInfoFormData: true,
      addressInfoFormData: true,
      educationInfoFormData: true,
      educationDegrees: true,
      occupationInfoFormData: true,
      familyInfoFormData: true,
      familySiblings: true,
      religiousInfoFormData: true,
      personalInfoFormData: true,
      marriageInfoFormData: true,
      spousePreferenceInfoFormData: true,
      guardianContacts: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  // console.log('user', user);
  return {
    ...biodata,
    biodataCompleted:
      biodata?.biodataCompleted && biodata?.biodataCompleted >= 100
        ? 100
        : biodata?.biodataCompleted,
    token: user?.token,
  };
};

const updateMyBiodata = async (
  userId: string,
  payload: BiodataFormData,
): Promise<Biodata> => {
  // Validate payload
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No data provided for update');
  }

  // Check if biodata exists
  const existingBiodata = await prisma.biodata.findFirst({
    where: { userId },
  });

  // Create or update biodata
  const biodata = await handleBiodataOperation(
    existingBiodata?.id || null,
    payload,
    userId,
  );

  // Fetch updated biodata with related records
  const biodataData = await prisma.biodata.findFirst({
    where: { id: biodata.id },
    include: {
      primaryInfoFormData: true,
      generalInfoFormData: true,
      addressInfoFormData: true,
      educationInfoFormData: true,
      occupationInfoFormData: true,
      familyInfoFormData: true,
      religiousInfoFormData: true,
      personalInfoFormData: true,
      marriageInfoFormData: true,
      spousePreferenceInfoFormData: true,
      guardianContacts: true,
    },
  });

  if (!biodataData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found after update');
  }

  return biodataData;
};

const getBiodataByAdmin = async (biodataId: string) => {
  const biodata = await prisma.biodata.findFirst({
    where: { id: biodataId },
    include: {
      primaryInfoFormData: true,
      generalInfoFormData: true,
      addressInfoFormData: true,
      educationInfoFormData: true,
      educationDegrees: true,
      occupationInfoFormData: true,
      familyInfoFormData: true,
      familySiblings: true,
      religiousInfoFormData: true,
      personalInfoFormData: true,
      marriageInfoFormData: true,
      spousePreferenceInfoFormData: true,
      guardianContacts: true,
    },
  });
  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }
  return biodata;
};

const updateBiodataByAdmin = async (
  biodataId: string,
  payload: Record<string, any>,
  updater: string,
): Promise<Biodata> => {
  await prisma.biodata.findFirstOrThrow({ where: { id: biodataId } });
  return handleBiodataOperation(biodataId, payload, updater, true);
};

const updateBiodataVisibility = async (
  biodataId: string,
  payload: Record<string, any>,
): Promise<Biodata> => {
  const biodata = await prisma.biodata.findFirst({
    where: { id: biodataId },
  });
  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }

  const result = await prisma.biodata.update({
    where: { id: biodataId },
    data: {
      visibility: payload.visibility,
      status: payload.status,
    },
  });

  await prisma.notification.create({
    data: {
      type: 'APPROVED_BIODATA',
      message:
        payload.status === 'APPROVED'
          ? ` আপনার বায়োডাটা এপ্রুভ হয়েছে। `
          : payload.status === 'REJECTED'
            ? ` আপনার বায়োডাটা রিজেক্ট করা হয়েছে। `
            : ` আপনার বায়োডাটা ডিলিট করা হয়েছে। `,
      userId: biodata.userId,
      biodataId: biodataId,
      isAdmin: false,
    },
  });

  return result;
};

const deleteABiodataRequest = async (
  payload: Record<string, any>,
  userId: string,
): Promise<Biodata | null> => {
  const biodata = await prisma.biodata.findFirst({
    where: { id: payload?.biodataId, userId },
  });

  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }

  const updatedBiodata = await prisma.biodata.update({
    where: { id: payload?.id },
    data: {
      status: BiodataStatus.DELETE_REQUESTED,
      visibility: VisibilityStatus.PRIVATE,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      bioDeleteReason: payload.bioDeleteReason,
      bkashNumber: payload.bkashNumber || null,
      spouseBiodata: payload.spouseBiodata || null,
    },
  });

  await prisma.notification.create({
    data: {
      type: 'BIO_DELETE_REQUESTED',
      adminMessage: `You have got a biodata delete request.`,
      userId,
      isAdmin: true,
      biodataId: payload?.biodataId,
    },
  });

  return null;
};

const deleteABiodata = async (
  biodataId: string,
  user: JwtPayload,
): Promise<Biodata | null> => {
  const { userId, role } = user;

  const biodata = await prisma.biodata.findFirst({
    where: { id: biodataId },
  });

  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }

  if (role === UserRole.USER) {
    if (biodata.userId !== userId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are not authorized to delete this biodata',
      );
    }

    await prisma.biodata.update({
      where: { id: biodataId },
      data: {
        status: BiodataStatus.DELETE_REQUESTED,
        visibility: VisibilityStatus.PRIVATE,
      },
    });

    await prisma.notification.create({
      data: {
        type: 'BIO_DELETE_REQUESTED',
        message: `আপনার বায়োডাটা ডিলিট করার জন্য রিকোয়েস্ট করা হয়েছে।`,
        userId,
        biodataId,
      },
    });

    return null;
  } else {
    await prisma.notification.create({
      data: {
        type: 'BIO_DELETE_SUCCESS',
        message: `আপনার বায়োডাটা সফলভাবে ডিলিট করা হয়েছে।`,
        userId: biodata.userId,
        biodataId,
      },
    });

    await prisma.biodata.delete({
      where: { id: biodataId },
    });

    return biodata;
  }
};

const getBiodataAnalytics = async (userId: string) => {
  const userData = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      biodatas: true,
      sentProposals: true,
      receivedProposals: true,
      favouriteBiodata: {
        include: {
          biodata: true,
        },
      },
      shortlistBiodata: {
        include: {
          biodata: true,
        },
      },
      ContactAccessSender: true,
      ContactAccessReceiver: true,
    },
  });

  const result = {
    // total received
    totalViews: userData?.biodatas?.totalViews,
    totalProposalReceived: userData?.receivedProposals?.length,
    totalShortlistReceived: userData?.shortlistBiodata?.filter(
      item => item.biodata?.userId === userId,
    )?.length,
    totalFavouriteReceived: userData?.favouriteBiodata?.filter(
      item => item.biodata?.userId === userId,
    )?.length,
    totalContactReceived: userData?.ContactAccessReceiver?.length,
    totalReportReceived: 0,
    // total sent
    totalFavouriteSent: userData?.favouriteBiodata?.filter(
      item => item.userId === userId,
    )?.length,
    totalShortlistSent: userData?.shortlistBiodata?.filter(
      item => item.userId === userId,
    )?.length,
    totalProposalSent: userData?.sentProposals?.length,
    totalContactSent: userData?.ContactAccessSender?.length,
    totalReportSent: 0,
  };
  return result;
};

export const BiodataServices = {
  createABiodata,
  getFilteredBiodata,
  getABiodata,
  getMyBiodata,
  getAllBiodata,
  updateMyBiodata,
  getBiodataByAdmin,
  updateBiodataByAdmin,
  deleteABiodataRequest,
  deleteABiodata,
  updateBiodataVisibility,
  getBiodataAnalytics,
};
