/*
  Warnings:

  - A unique constraint covering the columns `[cnic]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_cnic_key" ON "Vendor"("cnic");
