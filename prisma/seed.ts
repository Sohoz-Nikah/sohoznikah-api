import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all entries for each model in order of dependencies
    // First delete records that depend on other models
    await prisma.notification.deleteMany();
    await prisma.contactAccess.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.shortlistBiodata.deleteMany();
    await prisma.favouriteBiodata.deleteMany();
    await prisma.token.deleteMany();

    // Then delete biodata related records
    await prisma.biodataChangeLog.deleteMany();
    await prisma.biodataAddressInfo.deleteMany();
    await prisma.biodataEducationInfoDegree.deleteMany();
    await prisma.biodataEducationInfo.deleteMany();
    await prisma.biodataFamilyInfoSibling.deleteMany();
    await prisma.biodataFamilyInfo.deleteMany();
    await prisma.biodataGeneralInfo.deleteMany();
    await prisma.biodataMarriageInfo.deleteMany();
    await prisma.biodataOccupationInfo.deleteMany();
    await prisma.biodataPersonalInfo.deleteMany();
    await prisma.biodataPrimaryInfoGuardianContact.deleteMany();
    await prisma.biodataPrimaryInfo.deleteMany();
    await prisma.biodataReligiousInfo.deleteMany();
    await prisma.biodataSpousePreferenceInfo.deleteMany();

    // Then delete biodata records
    await prisma.biodata.deleteMany();

    // Finally delete users
    await prisma.user.deleteMany();

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
