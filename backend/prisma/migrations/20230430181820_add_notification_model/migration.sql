-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('FOLLOWED', 'POST_LIKE', 'POST_COMMENT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationTypeEnum" NOT NULL,
    "followedId" TEXT,
    "postLikeId" TEXT,
    "postCommentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_followedId_key" ON "Notification"("followedId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postLikeId_key" ON "Notification"("postLikeId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postCommentId_key" ON "Notification"("postCommentId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "Follow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postLikeId_fkey" FOREIGN KEY ("postLikeId") REFERENCES "PostLike"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postCommentId_fkey" FOREIGN KEY ("postCommentId") REFERENCES "PostComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
