/*
  Warnings:

  - A unique constraint covering the columns `[postId,commentedBy]` on the table `PostComment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostComment_postId_commentedBy_key" ON "PostComment"("postId", "commentedBy");
