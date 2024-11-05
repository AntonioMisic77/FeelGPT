/*
  Warnings:

  - You are about to alter the column `rating` on the `ItemReviewed` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(2,1)`.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(2,1)`.
  - A unique constraint covering the columns `[commentId,likedBy]` on the table `CommentLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,likedBy]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "ItemReviewed" ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userId",
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_commentId_likedBy_key" ON "CommentLike"("commentId", "likedBy");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_likedBy_key" ON "PostLike"("postId", "likedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Review_postId_key" ON "Review"("postId");
