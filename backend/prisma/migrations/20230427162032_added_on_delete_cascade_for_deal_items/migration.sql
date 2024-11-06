-- DropForeignKey
ALTER TABLE "DealItem" DROP CONSTRAINT "DealItem_dealId_fkey";

-- AddForeignKey
ALTER TABLE "DealItem" ADD CONSTRAINT "DealItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
