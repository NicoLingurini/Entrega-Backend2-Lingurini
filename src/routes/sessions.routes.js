import { Router } from "express";
import passport from "passport";
import { signToken } from "../utils/jwt.js";
import { COOKIE_NAME } from "../config/env.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    const user = req.user;
    const { password, ...safe } = user.toObject();
    res.status(201).json({ message: "Usuario registrado", user: safe });
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    const user = req.user;
    const token = signToken({
      uid: user._id,
      email: user.email,
      role: user.role,
    });

    res
      .cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax" })
      .json({ message: "Login ok", token });
  }
);

router.get("/current", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME).json({ message: "Logout ok" });
});

export default router;
