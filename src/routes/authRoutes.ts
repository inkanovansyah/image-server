import express from "express";
import { register, login, logout } from "../controllers/authController";


const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", logout);



export default router;