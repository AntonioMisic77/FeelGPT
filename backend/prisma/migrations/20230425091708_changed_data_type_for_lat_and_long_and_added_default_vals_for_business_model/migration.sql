/*
  Warnings:

  - You are about to alter the column `latitude` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(9,6)`.
  - You are about to alter the column `longitude` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(9,6)`.
  - You are about to alter the column `aggregateRating` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "reviewCount" SET DEFAULT 0,
ALTER COLUMN "aggregateRating" SET DEFAULT 0,
ALTER COLUMN "aggregateRating" SET DATA TYPE DECIMAL(2,1);
