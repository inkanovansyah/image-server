import express from "express";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postController";
import { authenticateToken  } from "../middleware/authMiddleware";

const router = express.Router();

router.get("get/allpost", getAllPosts);
router.get("/:slug", getPostBySlug);
router.post("/post",authenticateToken, createPost);
router.put("/update/:slug",authenticateToken, updatePost);
router.delete("/delete/:slug",authenticateToken, deletePost);

export default router;
