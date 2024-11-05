/*
  Warnings:

  - You are about to alter the column `price` on the `Deal` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(7,2)`.

*/
-- AlterTable
ALTER TABLE "Deal" ALTER COLUMN "price" SET DATA TYPE DECIMAL(7,2);
