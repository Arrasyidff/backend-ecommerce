import { z } from 'zod';

// Create product schema
export const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  description: z.string().min(1, { message: 'Product description is required' }),
  images: z.array(z.string()).optional().default([]),
  categoryId: z.string().min(1, { message: 'Category ID is required' }),
  stock: z.number().min(0, { message: 'Stock must be a positive number' }).default(0),
  slug: z.string().min(1, { message: 'Product slug is required' }).optional(),
});

// Update product schema
export const updateProductSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }).optional(),
  price: z.number().min(0, { message: 'Price must be a positive number' }).optional(),
  description: z.string().min(1, { message: 'Product description is required' }).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, { message: 'Category ID is required' }).optional(),
  stock: z.number().min(0, { message: 'Stock must be a positive number' }).optional(),
  slug: z.string().min(1, { message: 'Product slug is required' }).optional(),
});

// Product filter schema
export const productFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
});

// Schema type exports
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;