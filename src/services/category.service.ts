import { Category, ICategoryDocument } from '../models/category.model';
import { createCategorySchema, updateCategorySchema, CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';
import { AppError } from '../utils/app-error';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Get all categories
 */
const getAllCategories = async (): Promise<ICategoryDocument[]> => {
  try {
    return await Category.find().sort({ name: 1 });
  } catch (error) {
    throw new AppError(`Failed to get categories: ${(error as Error).message}`, 500);
  }
};

/**
 * Get category by ID
 */
const getCategoryById = async (id: string): Promise<ICategoryDocument> => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError(`Category not found with id: ${id}`, 404);
    }
    return category;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid category ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to get category: ${(error as Error).message}`, 500);
  }
};

/**
 * Get category by slug
 */
const getCategoryBySlug = async (slug: string): Promise<ICategoryDocument> => {
  try {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw new AppError(`Category not found with slug: ${slug}`, 404);
    }
    return category;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(`Failed to get category: ${(error as Error).message}`, 500);
  }
};

/**
 * Create a new category
 */
const createCategory = async (categoryData: CreateCategoryInput): Promise<ICategoryDocument> => {
  try {
    // Validate data
    const validatedData = createCategorySchema.parse(categoryData);
    
    // Generate slug if not provided
    if (!validatedData.slug && validatedData.name) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: validatedData.name },
        { slug: validatedData.slug }
      ]
    });
    
    if (existingCategory) {
      if (existingCategory.name === validatedData.name) {
        throw new AppError(`Category with name '${validatedData.name}' already exists`, 400);
      } else {
        throw new AppError(`Category with slug '${validatedData.slug}' already exists`, 400);
      }
    }
    
    // Create category
    const category = await Category.create(validatedData);
    return category;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error && error.name === 'MongoServerError' && (error as any).code === 11000) {
      throw new AppError('Category with this name or slug already exists', 400);
    }
    
    throw new AppError(`Failed to create category: ${(error as Error).message}`, 500);
  }
};

/**
 * Update a category
 */
const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryInput
): Promise<ICategoryDocument> => {
  try {
    // Validate data
    const validatedData = updateCategorySchema.parse(categoryData);
    
    // Generate slug if name is updated but slug is not provided
    if (validatedData.name && !validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError(`Category not found with id: ${id}`, 404);
    }
    
    // Check if updated name or slug already exists
    if (validatedData.name || validatedData.slug) {
      const query: any = { _id: { $ne: id } };
      
      if (validatedData.name) {
        query.name = validatedData.name;
      }
      
      if (validatedData.slug) {
        query.slug = validatedData.slug;
      }
      
      const existingCategory = await Category.findOne(query);
      if (existingCategory) {
        if (validatedData.name && existingCategory.name === validatedData.name) {
          throw new AppError(`Category with name '${validatedData.name}' already exists`, 400);
        } else if (validatedData.slug && existingCategory.slug === validatedData.slug) {
          throw new AppError(`Category with slug '${validatedData.slug}' already exists`, 400);
        }
      }
    }
    
    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      throw new AppError(`Category not found with id: ${id}`, 404);
    }
    
    return updatedCategory;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid category ID: ${id}`, 400);
    }
    
    if (error instanceof mongoose.Error && error.name === 'MongoServerError' && (error as any).code === 11000) {
      throw new AppError('Category with this name or slug already exists', 400);
    }
    
    throw new AppError(`Failed to update category: ${(error as Error).message}`, 500);
  }
};

/**
 * Delete a category
 */
const deleteCategory = async (id: string): Promise<void> => {
  try {
    // Check if the category is being used by any products
    const { Product } = require('../models/product.model');
    const productsCount = await Product.countDocuments({ categoryId: id });
    
    if (productsCount > 0) {
      throw new AppError(`Cannot delete category that is being used by ${productsCount} products`, 400);
    }
    
    const result = await Category.findByIdAndDelete(id);
    
    if (!result) {
      throw new AppError(`Category not found with id: ${id}`, 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid category ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to delete category: ${(error as Error).message}`, 500);
  }
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};