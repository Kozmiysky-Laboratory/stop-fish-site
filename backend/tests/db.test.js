import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Use a temporary database for testing.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stopfish-test-db-"));
const testDbPath = path.join(tmpDir, "test.sqlite");
process.env.DATABASE_PATH = testDbPath;

// Import db module after setting the env var so it creates the temp DB.
const { db, createUser, getUserByEmail, getUserById } = await import(
  "../src/db.js"
);

describe("db module", () => {
  after(() => {
    db.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("createUser", () => {
    test("creates a user and returns it with an id", () => {
      const user = createUser({
        fullName: "Тест Пользователь",
        email: "test@example.ru",
        passwordHash: "$2a$12$hashedpassword",
      });

      assert.ok(user.id);
      assert.equal(user.full_name, "Тест Пользователь");
      assert.equal(user.email, "test@example.ru");
      assert.equal(user.password_hash, "$2a$12$hashedpassword");
      assert.ok(user.created_at);
    });

    test("throws on duplicate email", () => {
      assert.throws(
        () =>
          createUser({
            fullName: "Дубль",
            email: "test@example.ru",
            passwordHash: "$2a$12$anotherhash",
          }),
        /UNIQUE constraint failed/
      );
    });
  });

  describe("getUserByEmail", () => {
    test("returns the user for an existing email", () => {
      const user = getUserByEmail("test@example.ru");
      assert.ok(user);
      assert.equal(user.email, "test@example.ru");
      assert.equal(user.full_name, "Тест Пользователь");
    });

    test("returns undefined for a non-existent email", () => {
      const user = getUserByEmail("nonexistent@example.ru");
      assert.equal(user, undefined);
    });
  });

  describe("getUserById", () => {
    test("returns the user for an existing id", () => {
      const found = getUserByEmail("test@example.ru");
      const user = getUserById(found.id);
      assert.ok(user);
      assert.equal(user.email, "test@example.ru");
    });

    test("returns undefined for a non-existent id", () => {
      const user = getUserById(99999);
      assert.equal(user, undefined);
    });
  });
});
