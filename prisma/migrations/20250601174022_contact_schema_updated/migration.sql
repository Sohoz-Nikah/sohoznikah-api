/*
  Warnings:

  - You are about to drop the column `userId` on the `ContactAccess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId,biodataId]` on the table `ContactAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `ContactAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `ContactAccess` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "ContactAccess" DROP CONSTRAINT "ContactAccess_userId_fkey";

-- DropIndex
DROP INDEX "ContactAccess_userId_biodataId_key";

-- AlterTable
ALTER TABLE "ContactAccess" DROP COLUMN "userId",
ADD COLUMN     "contactExpiredAt" TIMESTAMP(3),
ADD COLUMN     "contactStatus" "ContactStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "tokenRefunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenSpent" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "ContactAccess_senderId_receiverId_biodataId_key" ON "ContactAccess"("senderId", "receiverId", "biodataId");

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
