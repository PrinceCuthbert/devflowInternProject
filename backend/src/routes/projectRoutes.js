import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
// 1. IMPORT THE SECURITY GUARD
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 2. PUT THE GUARD IN FRONT OF EVERY ROUTE
// Base endpoint routes
router.get("/", verifyToken, getAllProjects);
router.post("/", verifyToken, createProject);

// Dynamic path parameter routes targeting specific IDs
router.get("/:id", verifyToken, getProjectById);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;