import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Bind the routes to the app
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome back to the DevFlow Core API Engine!" });
});

export default app;
