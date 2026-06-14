import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Use a temporary database for testing.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stopfish-test-routes-"));
const testDbPath = path.join(tmpDir, "test.sqlite");
process.env.DATABASE_PATH = testDbPath;

const { createApp } = await import("../src/app.js");

let server;
let baseUrl;

/**
 * Makes an HTTP request to the test server.
 * Handles cookies manually to simulate browser session behaviour.
 */
let cookieJar = "";

async function request(method, urlPath, body = null) {
  const url = `${baseUrl}${urlPath}`;
  const headers = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (cookieJar) {
    headers["Cookie"] = cookieJar;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  // Save set-cookie header for session tracking.
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    cookieJar = setCookie.split(";")[0];
  }
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  return { status: res.status, data };
}

describe("auth routes", () => {
  before(async () => {
    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    const { db } = await import("../src/db.js");
    db.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("POST /api/auth/register", () => {
    test("returns 400 for invalid input", async () => {
      const { status, data } = await request("POST", "/api/auth/register", {
        fullName: "",
        email: "bad",
        password: "1",
      });
      assert.equal(status, 400);
      assert.ok(data.fields.fullName);
      assert.ok(data.fields.email);
      assert.ok(data.fields.password);
    });

    test("creates a user with valid input and sets session", async () => {
      const { status, data } = await request("POST", "/api/auth/register", {
        fullName: "Новый Пользователь",
        email: "new@example.ru",
        password: "strongpass1",
      });
      assert.equal(status, 201);
      assert.ok(data.user);
      assert.equal(data.user.fullName, "Новый Пользователь");
      assert.equal(data.user.email, "new@example.ru");
      assert.ok(!data.user.password_hash, "password_hash must not be exposed");
    });

    test("returns 409 for duplicate email", async () => {
      const { status, data } = await request("POST", "/api/auth/register", {
        fullName: "Дубль",
        email: "new@example.ru",
        password: "strongpass2",
      });
      assert.equal(status, 409);
      assert.ok(data.error);
    });
  });

  describe("POST /api/auth/login", () => {
    test("returns 400 for missing fields", async () => {
      cookieJar = "";
      const { status, data } = await request("POST", "/api/auth/login", {
        email: "",
        password: "",
      });
      assert.equal(status, 400);
      assert.ok(data.fields.email);
      assert.ok(data.fields.password);
    });

    test("returns 401 for wrong password", async () => {
      const { status, data } = await request("POST", "/api/auth/login", {
        email: "new@example.ru",
        password: "wrongpassword",
      });
      assert.equal(status, 401);
      assert.ok(data.error);
    });

    test("returns user on successful login", async () => {
      const { status, data } = await request("POST", "/api/auth/login", {
        email: "new@example.ru",
        password: "strongpass1",
      });
      assert.equal(status, 200);
      assert.ok(data.user);
      assert.equal(data.user.email, "new@example.ru");
    });
  });

  describe("GET /api/auth/me", () => {
    test("returns 401 without a session", async () => {
      cookieJar = "";
      const { status, data } = await request("GET", "/api/auth/me");
      assert.equal(status, 401);
      assert.ok(data.error);
    });

    test("returns current user with valid session", async () => {
      // Login first to get a session.
      await request("POST", "/api/auth/login", {
        email: "new@example.ru",
        password: "strongpass1",
      });
      const { status, data } = await request("GET", "/api/auth/me");
      assert.equal(status, 200);
      assert.equal(data.user.email, "new@example.ru");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("destroys the session and returns 204", async () => {
      // Ensure we have an active session first.
      await request("POST", "/api/auth/login", {
        email: "new@example.ru",
        password: "strongpass1",
      });
      const { status } = await request("POST", "/api/auth/logout");
      assert.equal(status, 204);

      // After logout, /me should fail.
      const { status: meStatus } = await request("GET", "/api/auth/me");
      assert.equal(meStatus, 401);
    });
  });

  describe("GET /api/health", () => {
    test("returns ok status", async () => {
      const { status, data } = await request("GET", "/api/health");
      assert.equal(status, 200);
      assert.deepEqual(data, { status: "ok" });
    });
  });
});
