import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Register User
export const register = async (req: Request, res: Response) => {
    const { name, email, password, gender, address, city } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, gender, address, city },
    });

    res.json({ message: "User registered successfully", user });
};

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    await prisma.loginSession.create({
        data: { userId: user.id, token },
    });

    res.json({ status: "success", message: "Login successful", token });
};

// Logout User
export const logout = async (req: Request, res: Response) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token required" });

    await prisma.loginSession.deleteMany({ where: { token } });
    res.json({ message: "Logged out successfully" });
};
