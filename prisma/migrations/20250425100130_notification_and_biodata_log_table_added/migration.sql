/*
  Warnings:

  - You are about to drop the column `phoneConfirmed` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BiodataChangeType" AS ENUM ('UPDATE', 'DELETE', 'ADDITION');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneConfirmed";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "biodataId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiodataChangeLog" (
    "id" TEXT NOT NULL,
    "biodataId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "changedBy" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeType" "BiodataChangeType",
    "changes" JSONB,

    CONSTRAINT "BiodataChangeLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiodataChangeLog" ADD CONSTRAINT "BiodataChangeLog_biodataId_fkey" FOREIGN KEY ("biodataId") REFERENCES "Biodata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
