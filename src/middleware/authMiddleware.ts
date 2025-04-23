import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Tipe untuk data yang ada dalam token
interface DecodedToken {
  userId: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied, no token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    const session = await prisma.loginSession.findFirst({ where: { token } });

    if (!session) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    res.status(500).json({ message: "Unknown error occurred" });
  }
};
