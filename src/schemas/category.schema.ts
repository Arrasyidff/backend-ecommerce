import { z } from 'zod';

// Create category schema
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  slug: z.string().min(1, { message: 'Category slug is required' }).optional(),
});

// Update category schema
export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }).optional(),
  slug: z.string().min(1, { message: 'Category slug is required' }).optional(),
});

// Schema type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;