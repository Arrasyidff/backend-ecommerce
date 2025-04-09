import Joi from 'joi';

export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1)
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});