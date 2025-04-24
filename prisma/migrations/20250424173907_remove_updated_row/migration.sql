/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Count` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Count" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "updatedAt";
