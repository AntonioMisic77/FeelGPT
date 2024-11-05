-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postLikeId_fkey";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postLikeId_fkey" FOREIGN KEY ("postLikeId") REFERENCES "PostLike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
