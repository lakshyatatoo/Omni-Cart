import express from "express";
import {
  createOrderController,
  getUserOrdersController,
  getOrderController,
  getAllOrdersController,
  updateOrderStatusController,
  updateOrderPaymentController,
  cancelOrderController,
} from "../controllers/order.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";
import { orderValidator, mongoIdParam } from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", orderValidator, validate, createOrderController);
router.get("/", getUserOrdersController);

// Admin routes MUST come before /:id to avoid matching "admin" as an id
router.get("/admin/all", adminMiddleware, getAllOrdersController);

router.get("/:id", mongoIdParam, validate, getOrderController);
router.patch("/:id/cancel", mongoIdParam, validate, cancelOrderController);

router.patch(
  "/:id/status",
  adminMiddleware,
  mongoIdParam,
  validate,
  updateOrderStatusController,
);
router.patch(
  "/:id/payment",
  adminMiddleware,
  mongoIdParam,
  validate,
  updateOrderPaymentController,
);

export default router;
