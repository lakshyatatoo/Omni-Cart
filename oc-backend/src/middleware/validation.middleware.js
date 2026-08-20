import { validationResult } from 'express-validator';
import { AppError } from './error.middleware.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join('; ');
    return next(new AppError(messages, 400));
  }
  next();
};

export const sanitizeBody = (fields) => (req, res, next) => {
  fields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      req.body[field] = req.body[field].trim();
    }
  });
  next();
};