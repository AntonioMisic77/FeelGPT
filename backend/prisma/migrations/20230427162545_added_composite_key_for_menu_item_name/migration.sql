/*
  Warnings:

  - A unique constraint covering the columns `[menuCategoryId,name]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menuCategoryId_name_key" ON "MenuItem"("menuCategoryId", "name");
