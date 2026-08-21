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
import { User } from "../models/user.model.js";

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

  // Try DB-based admin login first (so token has a valid ObjectId)
  const adminUser = await User.findOne({ role: "admin" }).select("+password");
  if (adminUser) {
    const isMatch = await adminUser.comparePassword(password);
    if (isMatch && (adminUser.email === username || adminUser.name === username)) {
      const token = generateToken({ id: adminUser._id, role: "admin" }, "1d");
      return res.json({
        status: "success",
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: "admin",
        },
      });
    }
  }

  // Fallback to env var check
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return next(
      new AppError("Invalid admin credentials", 401),
    );
  }

  // Env credentials matched - find or create a DB admin user so the
  // token always carries a valid Mongoose ObjectId.
  let envAdmin = await User.findOne({ role: "admin" });
  if (!envAdmin) {
    envAdmin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });
  }

  const token = generateToken({ id: envAdmin._id, role: "admin" }, "1d");

  res.json({
    status: "success",
    token,
    user: {
      id: envAdmin._id,
      name: envAdmin.name,
      email: envAdmin.email,
      role: "admin",
    },
  });
});

export const adminLogout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    status: "success",
    message: "Admin logged out successfully",
  });
});
