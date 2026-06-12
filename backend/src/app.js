import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import betterSqlite3SessionStore from "better-sqlite3-session-store";
import cors from "cors";
import { config } from "./config.js";
import { db } from "./db.js";
import authRouter from "./routes/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQLiteStore = betterSqlite3SessionStore(session);

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    })
  );

  app.use(
    session({
      store: new SQLiteStore({
        client: db,
        expired: { clear: true, intervalMs: 15 * 60 * 1000 },
      }),
      name: "connect.sid",
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: config.isProduction ? "none" : "lax",
        secure: config.isProduction,
        maxAge: config.sessionMaxAgeMs,
      },
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);

  // Serve the static frontend so the whole site can run same-origin in dev.
  const frontendDir = path.resolve(__dirname, "../..");
  app.use(express.static(frontendDir));

  // 404 for unknown API routes.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Не найдено" });
  });

  // Centralized error handler.
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  });

  return app;
}
