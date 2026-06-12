import { createApp } from "./app.js";
import { config } from "./config.js";
import "./db.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Stop Fish backend listening on http://localhost:${config.port}`);
});
