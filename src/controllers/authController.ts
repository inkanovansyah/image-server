import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, gender, address, city } = req.body;
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
        return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, gender, address, city },
        });
        
        res.status(200).json({ message: "User registered successfully", user });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err });
        }
    };

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    await prisma.loginSession.create({
        data: { userId: user.id, token },
    });
    res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            address: user.address,
            city: user.city,
            token, // ← token dimasukkan dalam objek user
        },
    });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

// Logout User
// Logout User
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "Token required" });
        return;
    }
        await prisma.loginSession.deleteMany({ where: { token } });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};