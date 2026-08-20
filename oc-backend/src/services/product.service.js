import { Product } from '../models/product.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const getProducts = async (filters = {}) => {
  const { search, category, minPrice, maxPrice, page = 1, limit = 20, sort } = filters;
  
  const query = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (category) {
    query.category = category;
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.priceCents = {};
    if (minPrice !== undefined) query.priceCents.$gte = minPrice;
    if (maxPrice !== undefined) query.priceCents.$lte = maxPrice;
  }

  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'price_asc':
      sortOption = { priceCents: 1 };
      break;
    case 'price_desc':
      sortOption = { priceCents: -1 };
      break;
    case 'rating_desc':
      sortOption = { 'rating.stars': -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

export const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true
  });
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

export const searchProducts = async (searchTerm, limit = 10) => {
  const products = await Product.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
  
  return products;
};