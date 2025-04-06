import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { checkUser } from "../lib/checkUser";

const router = Router();

router.get('/:companyId', async (req: Request, res: Response) => {
    const { companyId } = req.params;

    const { dataExtracao, dataInicio, dataFim } = req.query;

    if (!companyId) {
        res.status(400).json({ message: "Company ID is required" });
        return;
    }

    const whereConditions: {
        companyId: string;
        data_extracao?: Date | { gte?: Date; lte?: Date };
    } = {
        companyId: companyId,
    };

    if (dataExtracao) {
        whereConditions.data_extracao = new Date(dataExtracao as string);
    }

    else if (dataInicio || dataFim) {
        whereConditions.data_extracao = {};

        if (dataInicio) {
            whereConditions.data_extracao.gte = new Date(dataInicio as string);
        }

        if (dataFim) {
            const fimData = new Date(dataFim as string);
            fimData.setHours(23, 59, 59, 999);
            whereConditions.data_extracao.lte = fimData;
        }
    }

    const query = {
        where: whereConditions,
        orderBy: {
            data_extracao: 'desc' as const,
        },
    };


    try {
        const owner = await prisma.company.findUnique({
            where: { id: companyId },
        });

        if (!owner) {
            res.status(404).json({ message: "Company not found" });
            return;
        }

        await checkUser(owner.userId);

        const salesData = await prisma.saleData.findMany(query);

        res.status(200).json(salesData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching sales data" });
    }
});

router.post('/', async (req: Request, res: Response) => {

    const { companyId, data_extracao, vendas_por_dia, vendas_por_grupo, vendas_por_atendente } = req.body;

    if (!companyId || !data_extracao || !vendas_por_dia || !vendas_por_grupo || !vendas_por_atendente) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {

        const formattedDate = new Date(data_extracao.split('T')[0] + 'T03:00:00.000Z');

        // Verificar se já existe um registro para esta data e empresa
        const existingSalesData = await prisma.saleData.findUnique({
            where: {
                companyId_data_extracao: {
                    companyId: companyId,
                    data_extracao: formattedDate,
                },
            },
        });

        let result

        if (existingSalesData) {
            // Atualizar o registro existente
            result = await prisma.saleData.update({
                where: {
                    id: existingSalesData.id,
                },
                data: {
                    vendas_por_dia,
                    vendas_por_grupo,
                    vendas_por_atendente,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Criar um novo registro
            result = await prisma.saleData.create({
                data: {
                    companyId,
                    data_extracao: formattedDate,
                    vendas_por_dia,
                    vendas_por_grupo,
                    vendas_por_atendente,
                },
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating sales data" });
    }
})


router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID is required" });
        return;
    }

    try {
        await prisma.saleData.delete({
            where: { id },
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting sales data" });
    }
})

export default router;
