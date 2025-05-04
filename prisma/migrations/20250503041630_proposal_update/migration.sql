/*
  Warnings:

  - You are about to drop the column `extendedTill` on the `Proposal` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "extendedTill",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
