// src/api/payments/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { paymentWebhookSchema } from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

// Endpoint simulasi payment webhook
router.post('/simulate-payment', validationMiddleware(paymentWebhookSchema), paymentController.simulatePayment);

export default router;