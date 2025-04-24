/*
  Warnings:

  - You are about to drop the column `barras` on the `Count` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `Count` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Count` table. All the data in the column will be lost.
  - Added the required column `companyCnpj` to the `Count` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Count" DROP CONSTRAINT "Count_productId_fkey";

-- AlterTable
ALTER TABLE "Count" DROP COLUMN "barras",
DROP COLUMN "local",
DROP COLUMN "productId",
ADD COLUMN     "companyCnpj" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_companyCnpj_fkey" FOREIGN KEY ("companyCnpj") REFERENCES "Company"("cnpj") ON DELETE CASCADE ON UPDATE CASCADE;
