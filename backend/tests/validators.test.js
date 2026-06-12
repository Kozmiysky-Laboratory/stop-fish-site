import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLogin, validateRegistration } from "../src/validators.js";

test("validateRegistration accepts valid input", () => {
  const { valid, errors } = validateRegistration({
    fullName: "Иван Петров",
    email: "ivan@example.ru",
    password: "secret123",
  });
  assert.equal(valid, true);
  assert.deepEqual(errors, {});
});

test("validateRegistration rejects short name, bad email and short password", () => {
  const { valid, errors } = validateRegistration({
    fullName: "a",
    email: "not-an-email",
    password: "123",
  });
  assert.equal(valid, false);
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.password);
});

test("validateLogin requires email and password", () => {
  const { valid, errors } = validateLogin({ email: "", password: "" });
  assert.equal(valid, false);
  assert.ok(errors.email);
  assert.ok(errors.password);
});

test("validateLogin accepts a well-formed email and any non-empty password", () => {
  const { valid } = validateLogin({
    email: "user@example.ru",
    password: "x",
  });
  assert.equal(valid, true);
});
