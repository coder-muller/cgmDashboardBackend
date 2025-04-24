/*
  Warnings:

  - Added the required column `produtoId` to the `Count` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Count" ADD COLUMN     "produtoId" TEXT NOT NULL;
