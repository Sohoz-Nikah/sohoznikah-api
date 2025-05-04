-- AlterEnum
ALTER TYPE "ProposalStatus" ADD VALUE 'NEED_TIME';

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "extendedTill" TIMESTAMP(3),
ADD COLUMN     "tokenSpent" BOOLEAN NOT NULL DEFAULT true;
