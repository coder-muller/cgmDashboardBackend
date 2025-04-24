import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

export interface Product {
    id: string;
    companyCnpj: string;
    codigo: number;
    barras: string;
    descricao: string;
    estoque: number;
    createdAt: Date;
    updatedAt: Date;
}

router.get("/:companyCnpj", async (req: Request, res: Response) => {
    try {
        const { companyCnpj } = req.params;

        const isValidCompany = await prisma.company.findUnique({
            where: {
                cnpj: companyCnpj,
            },
        });

        if (!isValidCompany) {
            res.status(400).json({ message: "Company not found" });
            return;
        }

        const products = await prisma.products.findMany({
            where: {
                companyCnpj
            },
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

router.get("/:companyCnpj/:filtro", async (req: Request, res: Response) => {
    try {
        const { companyCnpj, filtro } = req.params;

        let products ;

        if (!isNaN(parseInt(filtro)) && filtro.length <= 7) {
            console.log("codigo: ", filtro);
            products = await prisma.products.findMany({
                where: {
                    companyCnpj,
                    codigo: parseInt(filtro),
                },
            });
        } else if (!isNaN(parseInt(filtro)) && filtro.length >= 8) {
            console.log("barras: ", filtro);
            products = await prisma.products.findMany({
                where: {
                    companyCnpj,
                    barras: filtro
                },
            });
        } else {
            console.log("descricao: ", filtro);
            products = await prisma.products.findMany({
                where: {
                    companyCnpj,
                    descricao: {
                        contains: filtro,
                        mode: "insensitive",
                    },
                },
            });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product" });
    }
});

router.post("/:companyCnpj", async (req: Request, res: Response) => {
    try {
        const { companyCnpj } = req.params;
        const products = req.body;

        if (!products) {
            res.status(400).json({ message: "Products are required" });
            return;
        }

        const existingCompany = await prisma.company.findUnique({
            where: {
                cnpj: companyCnpj,
            },
        });

        if (!existingCompany) {
            res.status(400).json({ message: "Company not found" });
            return;
        }

        await prisma.products.deleteMany({
            where: {
                companyCnpj,
            },
        });

        const productsCreated = await prisma.products.createMany({
            data: products.map((product: Product) => ({
                companyCnpj,
                codigo: product.codigo,
                barras: product.barras,
                descricao: product.descricao,
                estoque: product.estoque,
            })),
        });

        res.status(201).json(productsCreated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product" });
    }
});

router.put("/:companyCnpj/:id/:estoque", async (req: Request, res: Response) => {
    console.log("PUT /:companyCnpj/:id/:estoque")
    try {
        const { companyCnpj, id, estoque } = req.params;

        console.log("companyCnpj: ", companyCnpj)
        console.log("id: ", id)
        console.log("estoque: ", estoque)

        if (!companyCnpj || !id || !estoque) {
            res.status(400).json({ message: "Company CNPJ, ID and estoque are required" });
            console.log("Company CNPJ, ID and estoque are required")
            return;
        }

        if (isNaN(parseInt(estoque))) {
            res.status(400).json({ message: "Estoque must be a number" });
            console.log("Estoque must be a number")
            return;
        }

        const product = await prisma.products.findUnique({
            where: {
                id,
            },  
        });

        if (!product) {
            res.status(400).json({ message: "Product not found" });
            console.log("Product not found")
            return;
        }

        await prisma.products.update({
            where: {
                id,
            },
            data: {
                estoque,
            },
        });

        res.status(200).json({ message: `Produto ${product.descricao} atualizado com sucesso. De: ${product.estoque} para: ${estoque}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product" });
    }
});

router.delete("/:companyCnpj", async (req: Request, res: Response) => {
    try {
        const { companyCnpj } = req.params;

        await prisma.count.deleteMany({
            where: {
                companyCnpj,
            },
        });

        await prisma.products.deleteMany({
            where: {
                companyCnpj,
            },
        });

        res.status(200).json({ message: "Products deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product" });
    }
});

export default router;