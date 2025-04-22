import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Tipe untuk data yang ada dalam token
interface DecodedToken {
  userId: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  // Jika token tidak ada
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    // Cek apakah token ada dalam session
    const session = await prisma.loginSession.findFirst({ where: { token } });

    // Jika session tidak ditemukan, token tidak valid
    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    // Menambahkan informasi user pada request object
    (req as any).user = decoded;

    // Melanjutkan ke middleware atau rute selanjutnya
    next();

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
