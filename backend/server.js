import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// 🛒 GraphQL & Apollo Server Core Infrastructure
// 🛒 NATIVE IMPORTS: No external subpath packages required!
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./src/graphql/typeDefs.js";
import { resolvers } from "./src/graphql/resolvers.js";

import { connectDB, sequelize } from "./src/config/database.js";
import "./src/models/User.js";
import "./src/models/Project.js";

import projectRoutes from "./src/routes/projectRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New real-time client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

// 🗄️ Legacy REST Endpoints kept perfectly intact for record/reference
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// 🚀 Initialize the Apollo Server Engine
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

// 🚀 Mount GraphQL using a DRY configuration block
// 🚀 Mount GraphQL natively using your existing app structure
app.use("/graphql", async (req, res, next) => {
  try {
    // 🛡️ Secure DRY Context Checkpoint
    let contextUser = null;
    const authHeader = req.headers.authorization || "";

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        contextUser = decoded;
      } catch (err) {
        // Token invalid or expired - catch safely
      }
    }

    // Execute the query string directly using Apollo's core compiler pipeline
    const result = await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: req.method,
        headers: new Headers(req.headers),
        body: req.body,
        search: new URL(req.url, `http://${req.headers.host}`).search,
      },
      context: async () => ({ user: contextUser }), // Passes context identity safely to resolvers
    });

    // Send the compiled structural response data back to the client terminal
    res.statusCode = result.status || 200;
    for (const [key, value] of result.headers) {
      res.setHeader(key, value);
    }

    if (result.body.kind === "complete") {
      res.send(result.body.string);
    } else {
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("🔄 Database tables synced with Sequelize!");

  server.listen(PORT, () => {
    console.log(`🚀 REST Engine running on http://localhost:${PORT}/api`);
    console.log(`🛒 GraphQL Gateway open on http://localhost:${PORT}/graphql`);
  });
};

startServer();
