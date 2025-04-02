import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { checkUser } from "../lib/checkUser";
const router = Router();

router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        await checkUser(userId);

        const companies = await prisma.company.findMany({
            where: { userId },
        });
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching companies" });
    }
});

router.get("/:userId/:id", async (req: Request, res: Response) => {
    try {
        const { userId, id } = req.params;

        if (!userId || !id) {
            res.status(400).json({ message: "User ID and Company ID are required" });
            return;
        }

        await checkUser(userId);

        const company = await prisma.company.findUnique({
            where: { id, userId },
        });

        if (!company) {
            res.status(404).json({ message: "Company not found" });
            return;
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error fetching company" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, cnpj, userId } = req.body;

        if (!name || !cnpj || !userId) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const existingCompany = await prisma.company.findUnique({
            where: { cnpj },
        });

        if (existingCompany) {
            res.status(400).json({ message: "Company already exists" });
            return;
        }

        const company = await prisma.company.create({
            data: {
                name,
                cnpj,
                userId,
            },
        });
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error creating company" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, cnpj } = req.body;

        if (!name && !cnpj) {
            res.status(400).json({ message: "No fields to update" });
            return;
        }

        const existingCompany = await prisma.company.findUnique({
            where: { cnpj },
        });

        if (existingCompany && existingCompany.id !== id) {
            res.status(400).json({ message: "Company already exists" });
            return;
        }

        const company = await prisma.company.update({
            where: { id },
            data: { name, cnpj },
        });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error updating company" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "Company ID is required" });
            return;
        }

        await prisma.company.delete({
            where: { id },
        });
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting company" });
    }
});



export default router;
