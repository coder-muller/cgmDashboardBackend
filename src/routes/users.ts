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
                createdAt: true,
                updatedAt: true,
                Company: {
                    select: {
                        id: true,
                        name: true,
                        cnpj: true,
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
                createdAt: true,
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

router.post("/:id/validation", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "Id é obrigatório" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const validatedUser = process.env.VALIDATED_USER;

        if (user.email === validatedUser) {
            res.status(400).json({ message: "Usuário já validado" });
            console.log("Passou aqui");
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { validated: !user.validated },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error validating user" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!id) {
            res.status(400).json({ message: "Id do usuário é obrigatório" });
            return;
        }

        if (!name && !email) {
            res.status(400).json({ message: "Nenhum campo para atualizar" });
            return;
        }

        const user = await prisma.user.update({
            where: { id },
            data: { name, email },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar o usuário" });
    }
});

router.put("/:id/password", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newPassword, currentPassword } = req.body;

        if (!id || !newPassword || !currentPassword) {
            res.status(400).json({ message: "Todos os campos são obrigatórios" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Senha atual inválida" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);

        if (isNewPasswordSame) {
            res.status(400).json({ message: "A nova senha não pode ser a mesma que a senha atual" });
            return;
        }

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar a senha" });
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
