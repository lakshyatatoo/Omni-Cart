import { body, param, query } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Product image is required'),
  
  body('priceCents')
    .notEmpty()
    .withMessage('Price is required')
    .isInt({ min: 0 })
    .withMessage('Price must be a positive integer'),
  
  body('rating.stars')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating stars must be between 0 and 5'),
  
  body('rating.count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Rating count must be a non-negative integer'),
  
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
  
  body('keywords.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each keyword must be a string'),
  
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .optional()
    .isString()
    .trim()
    .withMessage('Category must be a string'),
  
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean')
];

export const cartItemValidator = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  
  body('deliveryOptionId')
    .optional()
    .isString()
    .withMessage('Delivery option ID must be a string')
];

export const updateCartItemValidator = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('deliveryOptionId')
    .optional()
    .isString()
    .withMessage('Delivery option ID must be a string')
];

export const orderValidator = [
  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Shipping name is required'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('payment.method')
    .optional()
    .isIn(['stripe', 'paypal', 'cod'])
    .withMessage('Invalid payment method')
];

export const deliveryOptionValidator = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Delivery option ID is required'),
  
  body('deliveryDays')
    .notEmpty()
    .withMessage('Delivery days is required')
    .isInt({ min: 0 })
    .withMessage('Delivery days must be a non-negative integer'),
  
  body('priceCents')
    .notEmpty()
    .withMessage('Price is required')
    .isInt({ min: 0 })
    .withMessage('Price must be a non-negative integer')
];

export const mongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

export const productSearchValidator = [
  query('search')
    .optional()
    .isString()
    .trim()
    .withMessage('Search must be a string'),
  
  query('category')
    .optional()
    .isString()
    .trim()
    .withMessage('Category must be a string'),
  
  query('minPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum price must be a non-negative integer'),
  
  query('maxPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum price must be a non-negative integer'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'rating_desc', 'newest'])
    .withMessage('Invalid sort option')
];