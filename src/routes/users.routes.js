import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.get("/:uid", requireAuth, async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const user = await UserModel.findById(uid).select("-password");
    if (!user) return res.status(404).json({ error: "No encontrado" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } =
      req.body;
    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email ya registrado" });
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hash,
      cart: cart || null,
      role: role || "user",
    });
    const { password: _p, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) {
    next(err);
  }
});

router.put("/:uid", requireAuth, async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const data = { ...req.body };
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);
    const updated = await UserModel.findByIdAndUpdate(uid, data, {
      new: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ error: "No encontrado" });
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:uid", requireAuth, async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const deleted = await UserModel.findByIdAndDelete(uid).select("-password");
    if (!deleted) return res.status(404).json({ error: "No encontrado" });
    res.json({ user: deleted });
  } catch (err) {
    next(err);
  }
});

export default router;
