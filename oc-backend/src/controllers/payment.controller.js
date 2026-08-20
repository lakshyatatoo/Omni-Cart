import { processPayment } from "../services/payment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../middleware/error.middleware.js";

export const processPaymentController = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  if (!orderId || !paymentMethod) {
    throw new AppError("Order ID and payment method are required", 400);
  }

  const result = await processPayment({
    orderId,
    paymentMethod,
    ...req.body,
  });

  res.json({
    status: "success",
    ...result,
  });
});

export const paymentWebhookController = asyncHandler(async (req, res) => {
  // This would be called by Stripe/PayPal
  // For now, just acknowledge
  res.json({ received: true });
});
