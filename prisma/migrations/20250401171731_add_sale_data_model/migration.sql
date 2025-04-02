-- CreateTable
CREATE TABLE "SaleData" (
    "id" TEXT NOT NULL,
    "data_extracao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "vendas_por_dia" JSONB NOT NULL,
    "vendas_por_grupo" JSONB NOT NULL,
    "vendas_por_atendente" JSONB NOT NULL,

    CONSTRAINT "SaleData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleData_companyId_data_extracao_key" ON "SaleData"("companyId", "data_extracao");

-- AddForeignKey
ALTER TABLE "SaleData" ADD CONSTRAINT "SaleData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
