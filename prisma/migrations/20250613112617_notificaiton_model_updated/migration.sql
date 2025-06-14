-- DropForeignKey
ALTER TABLE "ContactAccess" DROP CONSTRAINT "ContactAccess_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ContactAccess" DROP CONSTRAINT "ContactAccess_senderId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "adminMessage" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "message" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAccess" ADD CONSTRAINT "ContactAccess_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
