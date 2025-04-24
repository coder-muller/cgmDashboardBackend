-- CreateTable
CREATE TABLE "Count" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,
    "barras" TEXT NOT NULL,
    "contagem" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
