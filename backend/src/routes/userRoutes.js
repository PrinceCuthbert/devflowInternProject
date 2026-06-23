import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 DOUBLE LOCK: You must be logged in (verifyToken) AND be an Admin (isAdmin)
router.get('/', verifyToken, isAdmin, getAllUsers);

export default router;