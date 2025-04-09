import Joi from 'joi';

export const checkoutSchema = Joi.object({
  shippingAddress: Joi.string(),
  paymentMethod: Joi.string()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED').required()
});