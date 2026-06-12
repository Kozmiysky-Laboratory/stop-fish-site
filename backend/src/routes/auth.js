import { Router } from "express";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, getUserById } from "../db.js";
import { validateLogin, validateRegistration } from "../validators.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const BCRYPT_ROUNDS = 12;

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    createdAt: user.created_at,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body ?? {};
    const { valid, errors } = validateRegistration({ fullName, email, password });
    if (!valid) {
      return res.status(400).json({ error: "Ошибка валидации", fields: errors });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (getUserByEmail(normalizedEmail)) {
      return res
        .status(409)
        .json({ error: "Пользователь с таким email уже существует" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = createUser({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    req.session.userId = user.id;
    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const { valid, errors } = validateLogin({ email, password });
    if (!valid) {
      return res.status(400).json({ error: "Ошибка валидации", fields: errors });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = getUserByEmail(normalizedEmail);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    req.session.userId = user.id;
    return res.json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", (req, res, next) => {
  if (!req.session) {
    return res.status(204).end();
  }
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    return res.status(204).end();
  });
});

router.get("/me", requireAuth, (req, res) => {
  const user = getUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  return res.json({ user: publicUser(user) });
});

export default router;
