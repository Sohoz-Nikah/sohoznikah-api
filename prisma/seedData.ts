import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Create three users
    const user1 = await prisma.user.create({
      data: {
        name: 'User One',
        email: 'user1@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'hashed_password1', // In practice, hash this properly
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'User Two',
        email: 'user2@example.com',
        phoneNumber: '0987654321',
        passwordHash: 'hashed_password2',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user3 = await prisma.user.create({
      data: {
        name: 'User Three',
        email: 'user3@example.com',
        phoneNumber: '1122334455',
        passwordHash: 'hashed_password3',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // Biodata 1: Groom, unmarried, 25 years old
    await prisma.biodata.create({
      data: {
        userId: user1.id,
        biodataType: 'GROOM',
        preApprovalAcceptTerms: true,
        preApprovalOathTruthfulInfo: true,
        preApprovalOathLegalResponsibility: true,
        postApprovalOathTruthfulInfo: true,
        postApprovalOathNoMisuse: true,
        postApprovalOathLegalResponsibility: true,
        profilePic: 'http://example.com/pic1.jpg',
        createdBy: user1.id,
        createdAt: new Date(),
        status: 'APPROVED',
        visibility: 'PUBLIC',
        primaryInfoFormData: {
          create: {
            biodataType: 'GROOM',
            biodataFor: 'Self',
            fullName: 'John Doe',
            fatherName: 'Father One',
            motherName: 'Mother One',
            email: 'john@example.com',
            phoneNumber: '1234567890',
          },
        },
        generalInfoFormData: {
          create: {
            dateOfBirth: '2000-01-01', // Age 25 in 2025
            maritalStatus: 'unmarried',
            skinTone: 'fair',
            height: '70', // 5'10"
            weight: '70', // 70 kg
            bloodGroup: 'A+',
            nationality: ['bangladeshi'],
          },
        },
        addressInfoFormData: {
          create: [
            {
              type: 'PRESENT',
              location: 'Dhaka',
              state: 'Dhaka',
              city: 'Dhaka',
              country: 'Bangladesh',
              detail: '123 Main St',
              permanentHomeAddress: '123 Main St',
              cityzenshipStatus: 'yes',
            },
            {
              type: 'PERMANENT',
              location: 'Dhaka',
              state: 'Dhaka',
              city: 'Dhaka',
              country: 'Bangladesh',
              detail: '123 Main St',
              permanentHomeAddress: '123 Main St',
              cityzenshipStatus: 'yes',
            },
          ],
        },
        educationInfoFormData: {
          create: {
            type: 'general',
            highestDegree: 'bachelor',
            religiousEducation: ['hafiz_male'],
            detail: "Bachelor's in Engineering",
          },
        },
        occupationInfoFormData: {
          create: {
            occupations: ['govt_job'],
            detail: 'Government Employee',
            monthlyIncome: '50000',
          },
        },
        religiousInfoFormData: {
          create: {
            type: 'devout',
            ideology: 'sunni',
            madhab: 'hanafi',
            praysFiveTimes: 'yes',
            hasQazaPrayers: 'no',
            canReciteQuranProperly: 'yes',
            avoidsHaramIncome: 'yes',
            modestDressing: 'yes',
            followsMahramRules: 'yes',
            beliefAboutPirMurshidAndMazar: 'unknown',
            practicingSince: 'since childhood',
          },
        },
      },
    });

    // Biodata 2: Bride, divorced, 30 years old
    await prisma.biodata.create({
      data: {
        userId: user2.id,
        biodataType: 'BRIDE',
        preApprovalAcceptTerms: true,
        preApprovalOathTruthfulInfo: true,
        preApprovalOathLegalResponsibility: true,
        postApprovalOathTruthfulInfo: true,
        postApprovalOathNoMisuse: true,
        postApprovalOathLegalResponsibility: true,
        profilePic: 'http://example.com/pic2.jpg',
        createdBy: user2.id,
        createdAt: new Date(),
        status: 'APPROVED',
        visibility: 'PUBLIC',
        primaryInfoFormData: {
          create: {
            biodataType: 'BRIDE',
            biodataFor: 'Self',
            fullName: 'Jane Smith',
            fatherName: 'Father Two',
            motherName: 'Mother Two',
            email: 'jane@example.com',
            phoneNumber: '0987654321',
          },
        },
        generalInfoFormData: {
          create: {
            dateOfBirth: '1995-01-01', // Age 30 in 2025
            maritalStatus: 'divorced',
            skinTone: 'medium',
            height: '65', // 5'5"
            weight: '60', // 60 kg
            bloodGroup: 'B+',
            nationality: ['foreign_citizen'],
          },
        },
        addressInfoFormData: {
          create: [
            {
              type: 'PRESENT',
              location: 'London',
              state: 'England',
              city: 'London',
              country: 'UK',
              detail: '456 High St',
              permanentHomeAddress: '456 High St',
              cityzenshipStatus: 'yes',
            },
            {
              type: 'PERMANENT',
              location: 'London',
              state: 'England',
              city: 'London',
              country: 'UK',
              detail: '456 High St',
              permanentHomeAddress: '456 High St',
              cityzenshipStatus: 'yes',
            },
          ],
        },
        educationInfoFormData: {
          create: {
            type: 'general',
            highestDegree: 'master',
            religiousEducation: ['hafiza_female'],
            detail: "Master's in Education",
          },
        },
        occupationInfoFormData: {
          create: {
            occupations: ['teacher'],
            detail: 'School Teacher',
            monthlyIncome: '40000',
          },
        },
        religiousInfoFormData: {
          create: {
            type: 'practicing',
            ideology: 'sunni',
            madhab: 'salafi',
            praysFiveTimes: 'yes',
            hasQazaPrayers: 'no',
            canReciteQuranProperly: 'yes',
            avoidsHaramIncome: 'yes',
            modestDressing: 'yes',
            followsMahramRules: 'yes',
            beliefAboutPirMurshidAndMazar: 'disagree',
            practicingSince: 'for 5 years',
          },
        },
      },
    });

    // Biodata 3: Groom, married, 40 years old
    await prisma.biodata.create({
      data: {
        userId: user3.id,
        biodataType: 'GROOM',
        preApprovalAcceptTerms: true,
        preApprovalOathTruthfulInfo: true,
        preApprovalOathLegalResponsibility: true,
        postApprovalOathTruthfulInfo: true,
        postApprovalOathNoMisuse: true,
        postApprovalOathLegalResponsibility: true,
        profilePic: 'http://example.com/pic3.jpg',
        createdBy: user3.id,
        createdAt: new Date(),
        status: 'APPROVED',
        visibility: 'PUBLIC',
        primaryInfoFormData: {
          create: {
            biodataType: 'GROOM',
            biodataFor: 'Self',
            fullName: 'Mike Johnson',
            fatherName: 'Father Three',
            motherName: 'Mother Three',
            email: 'mike@example.com',
            phoneNumber: '1122334455',
          },
        },
        generalInfoFormData: {
          create: {
            dateOfBirth: '1985-01-01', // Age 40 in 2025
            maritalStatus: 'married',
            skinTone: 'dark',
            height: '72', // 6'0"
            weight: '80', // 80 kg
            bloodGroup: 'O+',
            nationality: ['bangladeshi'],
          },
        },
        addressInfoFormData: {
          create: [
            {
              type: 'PRESENT',
              location: 'Chittagong',
              state: 'Chittagong',
              city: 'Chittagong',
              country: 'Bangladesh',
              detail: '789 Oak St',
              permanentHomeAddress: '789 Oak St',
              cityzenshipStatus: 'yes',
            },
            {
              type: 'PERMANENT',
              location: 'Chittagong',
              state: 'Chittagong',
              city: 'Chittagong',
              country: 'Bangladesh',
              detail: '789 Oak St',
              permanentHomeAddress: '789 Oak St',
              cityzenshipStatus: 'yes',
            },
          ],
        },
        educationInfoFormData: {
          create: {
            type: 'general',
            highestDegree: 'diploma',
            religiousEducation: [],
            detail: 'Diploma in IT',
          },
        },
        occupationInfoFormData: {
          create: {
            occupations: ['freelancer'],
            detail: 'Freelance Developer',
            monthlyIncome: '30000',
          },
        },
        religiousInfoFormData: {
          create: {
            type: 'general',
            ideology: 'shia',
            madhab: 'other_madhhab',
            praysFiveTimes: 'no',
            hasQazaPrayers: 'yes',
            canReciteQuranProperly: 'no',
            avoidsHaramIncome: 'no',
            modestDressing: 'no',
            followsMahramRules: 'no',
            beliefAboutPirMurshidAndMazar: 'agree',
            practicingSince: 'not practicing',
          },
        },
      },
    });

    console.log('Demo data created successfully.');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seedData();
