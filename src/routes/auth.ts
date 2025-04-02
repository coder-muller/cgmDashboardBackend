import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.validated) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, userId: user.id, userName: user.name });
});



export default router;
