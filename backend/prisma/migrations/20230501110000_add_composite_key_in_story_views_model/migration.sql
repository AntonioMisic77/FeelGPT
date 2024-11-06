/*
  Warnings:

  - A unique constraint covering the columns `[storyId,viewerId]` on the table `StoryView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoryView_storyId_viewerId_key" ON "StoryView"("storyId", "viewerId");
