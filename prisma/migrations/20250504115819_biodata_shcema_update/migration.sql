/*
  Warnings:

  - You are about to drop the column `code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Biodata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biodataType` to the `Biodata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Biodata` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BioDataType" AS ENUM ('GROOM', 'BRIDE');

-- DropIndex
DROP INDEX "User_code_key";

-- AlterTable
ALTER TABLE "Biodata" ADD COLUMN     "biodataType" "BioDataType" NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "code",
DROP COLUMN "gender";

-- DropEnum
DROP TYPE "GenderOption";

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_code_key" ON "Biodata"("code");
