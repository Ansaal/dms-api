/*
  Warnings:

  - Added the required column `dealershipId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "dealershipId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("dealershipId") ON DELETE RESTRICT ON UPDATE CASCADE;
