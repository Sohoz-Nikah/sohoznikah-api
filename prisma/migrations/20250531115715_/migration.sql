-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenRefunded" BOOLEAN NOT NULL DEFAULT false;
