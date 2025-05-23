import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all entries for each model

    await prisma.user.deleteMany();
    await prisma.biodata.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.biodataAddressInfo.deleteMany();
    await prisma.biodataChangeLog.deleteMany();
    await prisma.biodataEducationInfo.deleteMany();
    await prisma.biodataEducationInfoDegree.deleteMany();
    await prisma.biodataFamilyInfo.deleteMany();
    await prisma.biodataFamilyInfoSibling.deleteMany();
    await prisma.biodataGeneralInfo.deleteMany();
    await prisma.biodataMarriageInfo.deleteMany();
    await prisma.biodataOccupationInfo.deleteMany();
    await prisma.biodataPersonalInfo.deleteMany();
    await prisma.biodataPrimaryInfo.deleteMany();
    await prisma.biodataPrimaryInfoGuardianContact.deleteMany();
    await prisma.biodataReligiousInfo.deleteMany();
    await prisma.biodataSpousePreferenceInfo.deleteMany();

    console.log('All data deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Error in main:', error);
  process.exit(1);
});
