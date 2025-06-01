-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "contactAccessId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_contactAccessId_fkey" FOREIGN KEY ("contactAccessId") REFERENCES "ContactAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
