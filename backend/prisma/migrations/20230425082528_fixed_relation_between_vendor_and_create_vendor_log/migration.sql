/*
  Warnings:

  - A unique constraint covering the columns `[createdFor]` on the table `CreateVendorLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreateVendorLog_createdFor_key" ON "CreateVendorLog"("createdFor");
