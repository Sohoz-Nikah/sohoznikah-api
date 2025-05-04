/*
  Warnings:

  - Changed the type of `biodataType` on the `BiodataPrimaryInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BiodataPrimaryInfo" DROP COLUMN "biodataType",
ADD COLUMN     "biodataType" "BioDataType" NOT NULL;
