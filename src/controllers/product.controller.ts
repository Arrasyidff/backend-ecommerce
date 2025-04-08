import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError, catchAsync } from '../utils';

/**
 * Get all products with filtering options
 * @route GET /api/products
 * @access Public
 */
export const getProducts = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Konversi req.query ke format yang diharapkan oleh service
    const filterOptions = {
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10
    };
    const result = await productService.getProducts(filterOptions);

    res.status(200).json({
      status: 'success',
      results: result.products.length,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit
      },
      data: result.products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get product by slug
 * @route GET /api/products/slug/:slug
 * @access Public
 */
export const getProductBySlug = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create new product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productData = req.body;
    const product = await productService.createProduct(productData);

    res.status(201).json({
      status: 'success',
      data: product,
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
 * Update product
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
export const updateProduct = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const product = await productService.updateProduct(id, productData);

    res.status(200).json({
      status: 'success',
      data: product,
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
 * Delete product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
export const deleteProduct = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});