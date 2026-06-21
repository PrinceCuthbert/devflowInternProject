import express from "express";
import {
  getAllProjects,
  getProjectById, // Make sure to add this import line!
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Base endpoint routes
router.get("/", getAllProjects);
router.post("/", createProject);

// Dynamic path parameter routes targeting specific IDs
router.get("/:id", getProjectById); // 🔍 Added this line right here!
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
