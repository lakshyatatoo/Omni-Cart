import express from 'express';
import { processPaymentController, paymentWebhookController } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/process', processPaymentController);

// Webhook endpoint (no auth required - called by payment providers)
router.post('/webhook', paymentWebhookController);

export default router;