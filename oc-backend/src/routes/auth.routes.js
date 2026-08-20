import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  adminLogin,
  adminLogout,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { registerValidator, loginValidator } from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post("/signin", adminLogin);

router.post("/logout", logout);

router.post("/admin/logout", adminLogout);

router.use(authMiddleware);

router.get("/me", getMe);

router.patch("/profile", updateProfile);

router.patch("/password", updatePassword);

export default router;
