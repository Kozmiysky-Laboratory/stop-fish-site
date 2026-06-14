import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
  if (isProduction) {
    throw new Error("SESSION_SECRET must be set in production");
  }
  console.warn(
    "WARNING: SESSION_SECRET is not set — using an insecure default. " +
      "Set SESSION_SECRET in your .env file before deploying."
  );
}

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 3000,
  sessionSecret: process.env.SESSION_SECRET || "dev-insecure-secret",
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  databasePath: process.env.DATABASE_PATH || "./data/stopfish.sqlite",
};
