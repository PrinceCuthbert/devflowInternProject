import projects from "../data/mockDb.js";

// GET all projects
export const getAllProjects = (req, res) => {
  res.status(200).json(projects);
};

// POST a new project
export const createProject = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: "Validation Failed: 'name' field is required." });
  }
  const newProject = {
    id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
    name: name,
    status: "Planning",
  };
  projects.push(newProject);
  res.status(201).json(newProject);
};

// GET a single project by its ID (READ)
export const getProjectById = (req, res) => {
  // 1. Capture the structural parameter from the dynamic URL slice
  const id = parseInt(req.params.id);

  // 2. Search your mock data store for a matching entry
  const project = projects.find((p) => p.id === id);

  // 3. Fail Fast: If no record matches, return an explicit 404 response
  if (!project) {
    return res.status(404).json({ error: `Project with ID ${id} not found.` });
  }

  // 4. Success Pipeline: Return the isolated target object with a 200 code
  res.status(200).json(project);
};

// PUT (update) a project status or name
export const updateProject = (req, res) => {
  const id = parseInt(req.params.id);
  const { status, name } = req.body;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: `Project with ID ${id} not found.` });
  }
  if (status) project.status = status;
  if (name) project.name = name;
  res.status(200).json(project);
};

// DELETE a project
export const deleteProject = (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: `Project with ID ${id} not found.` });
  }
  projects.splice(projectIndex, 1);
  res
    .status(200)
    .json({ message: `Project ${id} successfully removed from memory.` });
};
