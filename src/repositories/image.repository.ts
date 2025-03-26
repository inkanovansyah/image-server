import prisma from '../config/prisma';
import { Image } from '@prisma/client';

export const createImage = async (filename: string, url: string): Promise<Image> => {
    return prisma.image.create({
        data: {
        filename,
        url,
        },
    });
};

export const getAllImages = async (): Promise<Image[]> => {
    return prisma.image.findMany();
};

export const getImageById = async (id: string): Promise<Image | null> => {
    return prisma.image.findUnique({ where: { id } });
};

export const deleteImage = async (id: string): Promise<Image> => {
    return prisma.image.delete({ where: { id } });
};