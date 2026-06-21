import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome back to the DevFlow Core API Engine!" });
});

export default app;
