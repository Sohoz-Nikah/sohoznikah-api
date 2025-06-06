/*
  Warnings:

  - You are about to drop the column `veilWithNiqab` on the `BiodataReligiousInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BiodataReligiousInfo" DROP COLUMN "veilWithNiqab";

-- AlterTable
ALTER TABLE "FavouriteBiodata" ADD COLUMN     "isShortlisted" BOOLEAN NOT NULL DEFAULT false;
