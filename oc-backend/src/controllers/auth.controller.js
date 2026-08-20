import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  adminLoginUser,
} from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../middleware/error.middleware.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const { user, token } = await registerUser(name, email, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser(email, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await getUserProfile(req.user._id);

  res.json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await updateUserProfile(req.user._id, req.body);

  res.json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  await changePassword(req.user._id, currentPassword, newPassword);

  res.json({
    status: "success",
    message: "Password updated successfully",
  });
});

export const adminLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return next(
      new AppError("Invalid admin credentials", 401),
    );
  }

  const token = generateToken({ id: "admin", role: "admin" }, "1d");

  res.json({
    status: "success",
    token,
    user: {
      id: "admin",
      role: "admin",
    },
  });
});
