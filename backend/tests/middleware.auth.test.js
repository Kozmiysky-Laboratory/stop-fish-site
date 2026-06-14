import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { requireAuth } from "../src/middleware/auth.js";

function mockRes() {
  const res = {
    _status: null,
    _body: null,
    status(code) {
      res._status = code;
      return res;
    },
    json(body) {
      res._body = body;
      return res;
    },
  };
  return res;
}

describe("requireAuth middleware", () => {
  test("returns 401 when session is missing", () => {
    const req = {};
    const res = mockRes();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res._status, 401);
    assert.deepEqual(res._body, { error: "Требуется авторизация" });
    assert.equal(nextCalled, false);
  });

  test("returns 401 when session exists but userId is missing", () => {
    const req = { session: {} };
    const res = mockRes();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res._status, 401);
    assert.equal(nextCalled, false);
  });

  test("returns 401 when session.userId is null", () => {
    const req = { session: { userId: null } };
    const res = mockRes();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res._status, 401);
    assert.equal(nextCalled, false);
  });

  test("calls next() when session has a valid userId", () => {
    const req = { session: { userId: 42 } };
    const res = mockRes();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res._status, null);
    assert.equal(res._body, null);
  });
});
