// src/api/payments/payment.validation.ts
import Joi from 'joi';

export const paymentWebhookSchema = Joi.object({
  orderId: Joi.string().required(),
  status: Joi.string().valid('success', 'failed', 'pending').default('success'),
  amount: Joi.number().positive().required(),
  transactionId: Joi.string(),
  paymentMethod: Joi.string()
});