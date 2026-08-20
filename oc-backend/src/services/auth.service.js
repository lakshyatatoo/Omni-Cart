import { User } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/error.middleware.js';

export const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const allowedUpdates = ['name', 'email'];
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

export const adminLoginUser = async (username, password) => {
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    throw new AppError('Invalid admin credentials', 401);
  }

  const token = generateToken({ id: 'admin', role: 'admin' }, '1d');

  return { token };
};