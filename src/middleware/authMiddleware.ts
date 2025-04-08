import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

     try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

        const session = await prisma.loginSession.findUnique({ where: { token } });
        if (!session) return res.status(401).json({ message: "Invalid session" });

        (req as any).user = decoded;
        next();
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
    }
};
