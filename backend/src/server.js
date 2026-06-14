import { createApp } from "./app.js";
import { config } from "./config.js";
import "./db.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`Stop Fish backend listening on http://localhost:${config.port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${config.port} is already in use`);
  } else {
    console.error("Server failed to start:", err);
  }
  process.exitCode = 1;
});
