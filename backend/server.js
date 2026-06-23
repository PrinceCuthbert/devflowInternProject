import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import http from "http"; // <-- 1. Import Node's native HTTP module
import { Server } from "socket.io"; // <-- 2. Import Socket.io

import { connectDB, sequelize } from "./src/config/database.js";
import './src/models/User.js';
import './src/models/Project.js';

import projectRoutes from "./src/routes/projectRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

// 3. Create the HTTP server explicitly so Socket.io can attach to it
const server = http.createServer(app);

// 4. Initialize Socket.io and allow your React frontend to connect
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Must match your Vite frontend URL!
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// 5. Listen for new real-time connections!
io.on("connection", (socket) => {
  console.log(`🔌 New real-time client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('🔄 Database tables synced with Sequelize!');

  // 6. CRITICAL: Use server.listen instead of app.listen!
  server.listen(PORT, () => {
    console.log(`🚀 DevFlow API & WebSocket Server running on http://localhost:${PORT}`);
  });
};

startServer();