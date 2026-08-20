import express from "express";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
  getPaymentSummaryController,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  cartItemValidator,
  updateCartItemValidator,
  mongoIdParam,
} from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCartController);
router.get("/payment-summary", getPaymentSummaryController);
router.post("/", cartItemValidator, validate, addToCartController);
router.patch(
  "/:productId",
  updateCartItemValidator,
  validate,
  updateCartItemController,
);
router.delete("/:productId", mongoIdParam, validate, removeFromCartController);
router.delete("/", clearCartController);

export default router;
