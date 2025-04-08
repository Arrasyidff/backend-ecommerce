import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().required().min(0),
  stock: Joi.number().integer().min(0).default(0),
  image: Joi.string().allow('', null),
  categoryId: Joi.string().required()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  image: Joi.string().allow('', null),
  categoryId: Joi.string()
}).min(1);

export const productFilterSchema = Joi.object({
  categoryId: Joi.string(),
  name: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0).greater(Joi.ref('minPrice')),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'price', 'createdAt').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc')
});