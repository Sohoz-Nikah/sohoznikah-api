/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Biodata,
  BiodataStatus,
  BioDataType,
  Prisma,
  VisibilityStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
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
  return await prisma.$transaction(async tx => {
    let biodata: Biodata;
    console.log('formData', formData);

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
    await handleRelatedRecords(tx, biodata.id, formData, userId);

    // Create notification
    await tx.notification.create({
      data: {
        type: biodataId ? 'UPDATE_BIODATA' : 'NEW_BIODATA',
        message: `Biodata ${biodataId ? 'updated' : 'created'} by user ID: ${userId}`,
        userId,
        biodataId: biodata.id,
        isGlobal: false,
      },
    });

    return biodata;
  });
}

// Helper function to handle related records with minimal database calls
async function handleRelatedRecords(
  tx: Prisma.TransactionClient,
  biodataId: string,
  formData: BiodataFormData,
  userId: string,
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
  const { guardianContacts } = primaryInfoFormData || {};

  console.log({
    firstWordsFormData,
    primaryInfoFormData,
    guardianContacts,
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
  });

  // Update biodata-level fields
  if (firstWordsFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: { ...firstWordsFormData },
    });
  }

  if (profilePicFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: { profilePic: profilePicFormData.photoId },
    });
  }

  if (finalWordsFormData) {
    await tx.biodata.update({
      where: { id: biodataId },
      data: {
        ...finalWordsFormData,
        visibility: finalWordsFormData.visibility as VisibilityStatus,
      },
    });
  }

  // Handle Primary Info (Single Record)
  if (primaryInfoFormData) {
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
        code: generatedId,
        biodataType: primaryInfoFormData.biodataType,
      },
    });

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
  }

  // Handle General Info (Single Record)
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
  }
  // Handle Address Info (Multiple Records)
  if (addressInfoFormData?.addresses?.length) {
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
  } else {
    await tx.biodataAddressInfo.deleteMany({ where: { biodataId } });
  }

  // Handle Education Info (Single Record)
  if (educationInfoFormData) {
    const { type, highestDegree, religiousEducation, detail, degrees } =
      educationInfoFormData;
    await tx.biodataEducationInfo.upsert({
      where: { biodataId },
      update: {
        type,
        highestDegree,
        religiousEducation,
        detail,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      create: {
        biodataId,
        type,
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
    } else {
      await tx.biodataEducationInfoDegree.deleteMany({ where: { biodataId } });
    }
  }

  // Handle Occupation Info (Single Record)
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
  }

  // Handle Family Info (Single Record)
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
  }

  // Handle Religious Info (Single Record)
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
  }

  // Handle Personal Info (Single Record)
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
  }

  // Handle Marriage Info (Single Record)
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
  }

  // Handle Spouse Preference Info (Single Record)
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
        secondMarrige,
        location,
        qualities,
        createdBy: userId,
      },
    });
  }
}

const createABiodata = async (
  req: Record<string, any>,
  creator: string,
): Promise<Biodata> => {
  console.log('req.body', req.body);
  return handleBiodataOperation(null, req.body, creator);
};

export const getFilteredBiodata = async (
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

  // 4) root‐level scalar:
  // if (currentState) {
  //   and.push({ currentState: { equals: currentState } });
  // }

  // 5) numeric ranges:
  const rangeClauses = buildRangeConditions(filters, rangeConfigs);
  console.log('rangeClauses', rangeClauses);
  and.push(...rangeClauses);

  // 6) the rest of your filters:
  const filterConditions = buildFilterConditions(
    restFilters,
    relationFieldMap as RelationMap,
  );
  if (Object.keys(filterConditions).length) {
    and.push(filterConditions);
  }

  // 7) final where:
  const where: Prisma.BiodataWhereInput = and.length ? { AND: and } : {};

  // 8) query + count:
  const [rows, total] = await Promise.all([
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
      },
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { id: 'desc' },
    }),
    prisma.biodata.count({ where }),
  ]);

  // 9) map to DTO:
  const data = rows.map(b => ({
    id: b.id,
    code: b.code,
    biodataType: b.primaryInfoFormData?.[0]?.biodataType,
    fullName: b.primaryInfoFormData?.[0]?.fullName,
    birthYear: b.generalInfoFormData?.[0]?.dateOfBirth,
    maritalStatus: b.generalInfoFormData?.[0]?.maritalStatus,
    height: b.generalInfoFormData?.[0]?.height,
    permanentAddress: b.addressInfoFormData?.[0]?.location,
    occupation: b.occupationInfoFormData?.[0]?.occupations,
    profilePic: b.profilePic,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));

  return {
    meta: { page, limit, total },
    data,
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
      guardianContacts: true,
    },
  });
  if (!biodata) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Biodata not found');
  }
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

const updateBiodataByAdmin = async (
  biodataId: string,
  payload: Record<string, any>,
  updater: string,
): Promise<Biodata> => {
  await prisma.biodata.findFirstOrThrow({ where: { id: biodataId } });
  return handleBiodataOperation(biodataId, payload, updater, true);
};

const deleteABiodata = async (biodataId: string): Promise<Biodata> => {
  await prisma.biodata.findFirstOrThrow({ where: { id: biodataId } });
  return prisma.biodata.delete({ where: { id: biodataId } });
};

export const BiodataServices = {
  createABiodata,
  getFilteredBiodata,
  getABiodata,
  getMyBiodata,
  updateMyBiodata,
  updateBiodataByAdmin,
  deleteABiodata,
};
