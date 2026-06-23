// 1. We delete the mockDb import and import our actual Sequelize Model!
import { Project } from '../models/Project.js';

// 1. Import our WebSocket pipeline from the main server file
import { io } from '../../server.js';

// GET ALL: Filtered by the logged-in user!
export const getAllProjects = async (req, res) => {
  try {
    // Sequelize translates this to: SELECT * FROM Projects WHERE userId = req.user.id;
    const userProjects = await Project.findAll({
      where: { userId: req.user.id }
    });
    res.status(200).json(userProjects);
  } catch (error) {
    res.status(500).json({ error: "Database error while fetching projects." });
  }
};

// CREATE/POST: Tag the new project with the logged-in user's ID
export const createProject = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required." });

  try {
    // Sequelize automatically creates the ID and timestamps!
    const newProject = await Project.create({
      name: name,
      userId: req.user.id // <-- SECURE TAG
    });

    // 2. BROADCAST: Tell all connected clients a new task exists
    io.emit("project_created", newProject);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project." });
  }
};

// GET a single project by its ID (READ - Secured for search)
export const getProjectById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // SECURITY LOCK: Must match BOTH the project ID and the User ID
    const project = await Project.findOne({
      where: { id: id, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ error: `Project with ID ${id} not found or access denied.` });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving project." });
  }
};

// PUT (update) a project status or name
export const updateProject = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, name } = req.body;

  try {
    // 1. Find it securely
    const project = await Project.findOne({
      where: { id: id, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ error: `Project not found or access denied.` });
    }

    // / Explicitly update values if they are provided in req.body
    if (name !== undefined) project.name = name;
    if (status !== undefined) project.status = status; // 🔥 This updates 'pending' <-> 'completed'

    // 3. Save changes back to MySQL
    await project.save();

    // 3. BROADCAST: Tell clients this specific task was updated
    io.emit("project_updated", project);

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project." });
  }
};

// DELETE a project
export const deleteProject = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Sequelize `.destroy()` deletes the row from MySQL
    const deletedCount = await Project.destroy({
      where: { id: id, userId: req.user.id }
    });

    // If deletedCount is 0, nothing was deleted (either didn't exist or belonged to someone else)
    if (deletedCount === 0) {
      return res.status(404).json({ error: `Project not found or access denied.` });
    }

    // 4. BROADCAST: Tell clients to remove this ID from their screens
    // We include the userId so React knows WHOSE task was deleted
    io.emit("project_deleted", { id: id, userId: req.user.id });

    res.status(200).json({ message: `Project ${id} successfully removed from the database.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project." });
  }
};