import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET all posts
export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch posts", error: err });
    }
};

// GET post by slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    try {
        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch post", error: err });
    }
};

// CREATE post
export const createPost = async (
    req: Request & { user?: any },
    res: Response
): Promise<void> => {
    const { title, slug, content, metaDesc, imageUrl } = req.body;
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                metaDesc,
                imageUrl: imageUrl ?? null, 
                 // penting: biar Prisma gak error kalau undefined
            },
        });
        res.status(201).json({
            status: "success",
            message: "Image uploaded successfully",
            data: post,
          });
    } catch (err) {
        res.status(500).json({ message: "Failed to create post", error: err });
    }
};

// UPDATE post
export const updatePost = async (
    req: Request & { user?: any },
    res: Response
): Promise<void> => {
    const { slug } = req.params;
    const { title, content, metaDesc } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.id !== userId) {
            res.status(403).json({ message: "Forbidden: not your post" });
            return;
        }

        const updated = await prisma.post.update({
            where: { slug },
            data: { title, content, metaDesc },
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update post", error: err });
    }
};

// DELETE post
export const deletePost = async (
    req: Request & { user?: any },
    res: Response
): Promise<void> => {
    const { slug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const post = await prisma.post.findUnique({ where: { slug } });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.id !== userId) {
            res.status(403).json({ message: "Forbidden: not your post" });
            return;
        }

        await prisma.post.delete({ where: { slug } });
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete post", error: err });
    }
};
