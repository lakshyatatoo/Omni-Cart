import { User } from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "./error.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401),
    );
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401),
    );
  }

  const user = await User.findById(decoded.id).select("+password");
  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  if (!user.isActive) {
    return next(
      new AppError(
        "Your account has been deactivated. Please contact support.",
        401,
      ),
    );
  }

  req.user = user;
  next();
});

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action.", 403),
    );
  }
  next();
};
