/*
  Warnings:

  - You are about to drop the column `mobile` on the `BiodataPrimaryInfo` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `BiodataPrimaryInfoGuardianContact` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `BiodataPrimaryInfoGuardianContact` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `BiodataPrimaryInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiodataPrimaryInfo" DROP COLUMN "mobile",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BiodataPrimaryInfoGuardianContact" DROP COLUMN "mobile",
DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
