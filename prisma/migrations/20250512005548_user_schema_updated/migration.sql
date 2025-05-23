/*
  Warnings:

  - The `accountType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "User_accountType_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountType",
ADD COLUMN     "accountType" TEXT;

-- DropEnum
DROP TYPE "AccountType";
