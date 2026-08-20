import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProductController = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({
    status: "success",
    product,
  });
});

export const getProductsController = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search,
    category: req.query.category,
    minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : undefined,
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 20,
    sort: req.query.sort,
  };

  const result = await getProducts(filters);
  res.json({
    status: "success",
    ...result,
  });
});

export const getProductController = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  res.json({
    status: "success",
    product,
  });
});

export const updateProductController = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.json({
    status: "success",
    product,
  });
});

export const deleteProductController = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

export const searchProductsController = asyncHandler(async (req, res) => {
  const searchTerm = req.query.q;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  if (!searchTerm) {
    return res.json({ status: "success", products: [] });
  }

  const products = await searchProducts(searchTerm, limit);
  res.json({
    status: "success",
    products,
  });
});
