-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "companyCnpj" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,
    "barras" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_companyCnpj_fkey" FOREIGN KEY ("companyCnpj") REFERENCES "Company"("cnpj") ON DELETE CASCADE ON UPDATE CASCADE;
