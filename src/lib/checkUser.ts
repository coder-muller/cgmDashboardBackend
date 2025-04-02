import { NextFunction } from "express";
import prisma from "./prisma";

export const checkUser = async (userId: string) => {

    if (!userId) {
        throw new Error("User ID is required");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.validated) {
        throw new Error("User not validated");
    }

    return user;
}
