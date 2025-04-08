import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError, catchAsync } from '../utils';

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get category by slug
 * @route GET /api/categories/slug/:slug
 * @access Public
 */
export const getCategoryBySlug = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create new category
 * @route POST /api/categories
 * @access Private/Admin
 */
export const createCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryData = req.body;
    const category = await categoryService.createCategory(categoryData);

    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return next(new AppError(
        `Validation failed: ${JSON.stringify(formattedErrors)}`, 
        400
      ));
    }
    next(error);
  }
});

/**
 * Update category
 * @route PUT /api/categories/:id
 * @access Private/Admin
 */
export const updateCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const category = await categoryService.updateCategory(id, categoryData);

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return next(new AppError(
        `Validation failed: ${JSON.stringify(formattedErrors)}`, 
        400
      ));
    }
    next(error);
  }
});

/**
 * Delete category
 * @route DELETE /api/categories/:id
 * @access Private/Admin
 */
export const deleteCategory = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});