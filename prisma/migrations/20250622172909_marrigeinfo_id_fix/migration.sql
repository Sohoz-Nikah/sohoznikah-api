/*
  Warnings:

  - The primary key for the `BiodataMarriageInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BiodataMarriageInfo" DROP CONSTRAINT "BiodataMarriageInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BiodataMarriageInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BiodataMarriageInfo_id_seq";
