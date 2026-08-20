import express from "express";
import {
  createProductController,
  getProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  searchProductsController,
} from "../controllers/product.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";
import {
  productValidator,
  mongoIdParam,
  productSearchValidator,
} from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

router.get("/", productSearchValidator, validate, getProductsController);
router.get(
  "/search",
  productSearchValidator,
  validate,
  searchProductsController,
);
router.get("/:id", mongoIdParam, validate, getProductController);

router.use(authMiddleware, adminMiddleware);

router.post("/", productValidator, validate, createProductController);
router.patch(
  "/:id",
  mongoIdParam,
  productValidator,
  validate,
  updateProductController,
);
router.delete("/:id", mongoIdParam, validate, deleteProductController);

export default router;
