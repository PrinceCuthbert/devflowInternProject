import app from "./src/app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 DevFlow ESM API Server safely restored on http://localhost:${PORT}`,
  );
});
