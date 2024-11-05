/*
  Warnings:

  - A unique constraint covering the columns `[businessId,name]` on the table `Deal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DealItem" ALTER COLUMN "quantity" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Deal_businessId_name_key" ON "Deal"("businessId", "name");
