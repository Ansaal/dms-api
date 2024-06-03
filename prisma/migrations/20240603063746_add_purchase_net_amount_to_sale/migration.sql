/*
  Warnings:

  - Added the required column `purchaseNetAmount` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "purchaseNetAmount" DOUBLE PRECISION NOT NULL default 0;
