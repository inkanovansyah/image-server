import express from "express";
import { uploadImage, getAllImages, getImageById, deleteImage } from "../controllers/imageController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.get("/:id", getImageById);
router.delete("/:id", deleteImage);

export default router;
