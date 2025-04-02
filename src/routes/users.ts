import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                validated: true,
                Company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                validated: true,
                Company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const validatedUser = process.env.VALIDATED_USER;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                validated: email === validatedUser,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        if (!name && !email && !password) {
            res.status(400).json({ message: "No fields to update" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { id },
            data: { name, email, password: hashedPassword },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});


export default router;
