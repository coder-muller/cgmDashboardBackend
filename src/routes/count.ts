import { Router } from "express";
import prisma from "../lib/prisma";

const countRouter = Router();

countRouter.post("/", async (req, res) => {
    const { codigo, contagem, companyCnpj, produtoId } = req.body;

    if (!codigo || !contagem || !companyCnpj || !produtoId) {
        res.status(400).json({ message: "Codigo, contagem, companyCnpj and produtoId are required" });
        return;
    }

    if (isNaN(parseInt(codigo))) {
        res.status(400).json({ message: "Codigo must be a number" });
        return;
    }

    if (isNaN(parseInt(contagem))) {
        res.status(400).json({ message: "Contagem must be a number" });
        return;
    }

    try {
        const count = await prisma.count.create({
            data: { codigo, contagem, companyCnpj, produtoId },
        });

        res.status(201).json(count);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating count" });
    }
});

countRouter.get("/:companyCnpj", async (req, res) => {
    try {
        const counts = await prisma.count.findMany({
            where: {
                companyCnpj: req.params.companyCnpj,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        res.status(200).json(counts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching counts" });
    }
});

countRouter.delete("/:companyCnpj/:id", async (req, res) => {

    const { companyCnpj, id } = req.params;

    if (!companyCnpj || !id) {
        res.status(400).json({ message: "Company CNPJ and ID are required" });
        return 
    }

    try {
        await prisma.count.delete({
            where: { id: id },
        });

        res.status(200).json({ message: "Count deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting count" });
    }
});

export default countRouter;