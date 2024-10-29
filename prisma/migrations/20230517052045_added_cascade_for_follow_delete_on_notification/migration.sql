-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_followedId_fkey";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "Follow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
