import express from "express";
import {
  getDeliveryOptionsController,
  getDeliveryOptionController,
  createDeliveryOptionController,
  updateDeliveryOptionController,
  deleteDeliveryOptionController,
  seedDeliveryOptionsController,
} from "../controllers/deliveryOption.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";
import { deliveryOptionValidator } from "../validators/index.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

router.get("/", getDeliveryOptionsController);
router.get("/seed", seedDeliveryOptionsController);
router.get("/:id", getDeliveryOptionController);

router.use(authMiddleware, adminMiddleware);

router.post(
  "/",
  deliveryOptionValidator,
  validate,
  createDeliveryOptionController,
);
router.patch(
  "/:id",
  deliveryOptionValidator,
  validate,
  updateDeliveryOptionController,
);
router.delete("/:id", deleteDeliveryOptionController);

export default router;
