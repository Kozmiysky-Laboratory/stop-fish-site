import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { config } from "./config.js";

const databasePath = path.resolve(config.databasePath);
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name     TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
} catch (err) {
  throw new Error(`Failed to initialise users table: ${err.message}`, {
    cause: err,
  });
}

export function createUser({ fullName, email, passwordHash }) {
  const stmt = db.prepare(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES (@fullName, @email, @passwordHash)`
  );
  let result;
  try {
    result = stmt.run({ fullName, email, passwordHash });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      const dup = new Error("Пользователь с таким email уже существует");
      dup.status = 409;
      throw dup;
    }
    throw err;
  }
  return getUserById(result.lastInsertRowid);
}

export function getUserByEmail(email) {
  return db
    .prepare(
      "SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = ?"
    )
    .get(email);
}

export function getUserById(id) {
  return db
    .prepare("SELECT id, full_name, email, created_at FROM users WHERE id = ?")
    .get(id);
}
