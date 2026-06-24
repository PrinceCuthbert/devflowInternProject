import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { io } from "../../server.js"; // Keep real-time sockets operational!

const normalizeProject = (projectRecord) => {
  const project =
    typeof projectRecord?.get === "function"
      ? projectRecord.get({ plain: true })
      : projectRecord;

  const id = project?.id;
  const userIdRaw = project?.userId ?? project?.UserId;
  const userId = Number.parseInt(userIdRaw, 10);

  if (id == null || Number.isNaN(userId)) {
    throw new Error("Invalid project payload shape from database.");
  }

  return {
    id: String(id),
    name: project.name,
    status: project.status,
    userId,
    createdAt: String(project.createdAt),
    updatedAt: String(project.updatedAt),
  };
};

export const resolvers = {
  Query: {
    // Fetches profile data of the logged-in user passing through the context gate
    me: async (_, __, context) => {
      if (!context.user)
        throw new Error("Unauthorized access. Token missing or invalid.");
      return await User.findByPk(context.user.id, {
        attributes: { exclude: ["password"] }, // Secure data masking
      });
    },

    // Fetches all projects belonging exclusively to this user
    // Fetches all projects belonging exclusively to this user
    myProjects: async (_, __, context) => {
      if (!context.user)
        throw new Error("Unauthorized access. Token missing or invalid.");

      try {
        const targetUserId = parseInt(context.user.id, 10);
        console.log(
          `🔍 GraphQL Fetching projects for authenticated UserId: ${targetUserId}`,
        );

        const projects = await Project.findAll({
          where: { userId: targetUserId },
        });

        return projects.map(normalizeProject);
      } catch (error) {
        console.error("Database resolution error:", error);
        throw new Error("Failed to process database rows.");
      }
    },
  },

  Mutation: {
    // CREATE
    createProject: async (_, { name }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      if (!name) throw new Error("Project name is required.");

      const newProject = await Project.create({
        name: name,
        userId: context.user.id,
      });

      const normalizedProject = normalizeProject(newProject);

      // Maintain our real-time WebSockets broadcast!
      io.emit("project_created", normalizedProject);

      return normalizedProject;
    },

    // UPDATE
    updateProject: async (_, { id, name, status }, context) => {
      if (!context.user) throw new Error("Unauthorized");

      const project = await Project.findOne({
        where: { id: id, userId: context.user.id },
      });
      if (!project) throw new Error("Project not found or access denied.");

      if (name !== undefined) project.name = name;
      if (status !== undefined) project.status = status;

      await project.save();

      const normalizedProject = normalizeProject(project);

      // Broadcast update live over WebSockets pipeline
      io.emit("project_updated", normalizedProject);

      return normalizedProject;
    },

    // DELETE
    deleteProject: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");

      const deletedCount = await Project.destroy({
        where: { id: id, userId: context.user.id },
      });
      if (deletedCount === 0)
        throw new Error("Project not found or access denied.");

      // Broadcast delete event over sockets
      io.emit("project_deleted", { id: parseInt(id), userId: context.user.id });

      return `Project successfully removed from the database.`;
    },
  },
};
