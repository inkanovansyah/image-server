import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Upload Gambar
export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const fileUrl = `/fileimage/${req.file.filename}`;
        const image = await prisma.image.create({
        data: {
            filename: req.file.filename,
            url: fileUrl,
        },
    });
        res.json({ image });
    } catch (error) {
        next(error);
    }
};

// Get Semua Gambar
export const getAllImages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const images = await prisma.image.findMany();
    res.json(images);
  } catch (error) {
    next(error);
  }
};

// Get Gambar Berdasarkan ID
export const getImageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    res.json(image);
  } catch (error) {
    next(error);
  }
};

// Delete Gambar
export const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    const filePath = path.join(__dirname, "../uploads", image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.image.delete({ where: { id } });
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};
