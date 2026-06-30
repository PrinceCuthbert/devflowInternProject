import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { Otp } from "../models/Otp.js";
import { io } from "../../server.js"; // Keep real-time sockets operational!
import { addNotificationJob } from "../services/queueService.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_keycard_auth";

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
    // 🔐 TWO-STEP AUTHENTICATION: STEP 1 (Verify Password & Dispatch OTP Job)
    loginWithEmailPassword: async (
      _,
      { username, password, deliveryMethod },
    ) => {
      // 1. Verify user profile exists
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("Invalid username or security credentials.");

      // 2. Validate hashed credential match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new Error("Invalid username or security credentials.");

      // 3. Generate a secure, 6-digit cryptographic numeric OTP
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      const hashedOtp = await bcrypt.hash(generatedOtp, 10);
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5-minute lifespan

      // 4. Save code configuration to database tables
      await Otp.create({
        userId: user.id,
        codeHash: hashedOtp,
        purpose: "LOGIN",
        expiresAt: expirationTime,
      });

      // 5. Select routing endpoint safely based on selection
      const destination =
        deliveryMethod === "SMS" ? user.phoneNumber : user.email;

      // 6. Push transactional communication job to BullMQ memory simulation
      addNotificationJob({
        to: destination,
        type: deliveryMethod, // Matches 'EMAIL' or 'SMS' strings
        body: `Your Project Repo secure authentication pin code is: ${generatedOtp}. Valid for 5 minutes.`,
      });

      // 7. Mint short-lived stepToken to securely preserve state context on frontend
      const stepToken = jwt.sign(
        { userId: user.id, type: "MFA_STAGE" },
        JWT_SECRET,
        { expiresIn: "5m" },
      );

      return {
        requiresOtp: true,
        stepToken,
        user: null,
        token: null,
      };
    },

    // 🔓 TWO-STEP AUTHENTICATION: STEP 2 (Verify OTP Pin & Return Permanent Access Tokens)
    verifyOtp: async (_, { stepToken, code }) => {
      try {
        // 1. Parse incoming intermediate stage signature
        const decoded = jwt.verify(stepToken, JWT_SECRET);
        if (decoded.type !== "MFA_STAGE")
          throw new Error("Invalid stage signature.");

        const user = await User.findByPk(decoded.userId, {
          attributes: { exclude: ["password"] },
        });
        if (!user) throw new Error("User associated with session not found.");

        // 2. Query valid live active security pins
        const activeOtps = await Otp.findAll({
          where: { userId: user.id, purpose: "LOGIN" },
        });

        let validOtpRecord = null;
        for (const record of activeOtps) {
          if (new Date() < new Date(record.expiresAt)) {
            const match = await bcrypt.compare(code, record.codeHash);
            if (match) {
              validOtpRecord = record;
              break;
            }
          }
        }

        if (!validOtpRecord)
          throw new Error(
            "The entered verification code is incorrect or expired.",
          );

        // 3. Purge verification hashes from database upon validation success
        await Otp.destroy({ where: { userId: user.id } });

        // 4. Issue standard permanent 24-hour access JWT payload token
        const permanentToken = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: "24h" },
        );

        return {
          requiresOtp: false,
          stepToken: null,
          user,
          token: permanentToken,
        };
      } catch (err) {
        throw new Error(err.message || "MFA validation sequence failure.");
      }
    },

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
