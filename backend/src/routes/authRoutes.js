import express from "express";
import { register, login, githubAuth, googleAuth } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/github", githubAuth);
router.post("/google", googleAuth);

export default router;
