/*
  Warnings:

  - You are about to alter the column `price` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(7,2)`.
  - You are about to alter the column `aggregateRating` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(2,1)`.
  - A unique constraint covering the columns `[businessId,name]` on the table `MenuCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(7,2),
ALTER COLUMN "reviewCount" SET DEFAULT 0,
ALTER COLUMN "aggregateRating" SET DEFAULT 0,
ALTER COLUMN "aggregateRating" SET DATA TYPE DECIMAL(2,1);

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_businessId_name_key" ON "MenuCategory"("businessId", "name");
