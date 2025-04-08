import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('', null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
}).min(1);