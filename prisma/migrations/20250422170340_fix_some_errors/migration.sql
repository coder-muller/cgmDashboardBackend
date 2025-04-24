/*
  Warnings:

  - You are about to alter the column `contagem` on the `Count` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,4)`.
  - You are about to alter the column `estoque` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,4)`.
  - Added the required column `local` to the `Count` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Count" ADD COLUMN     "local" INTEGER NOT NULL,
ALTER COLUMN "contagem" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "estoque" SET DATA TYPE DECIMAL(10,4);
