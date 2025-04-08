import { Product, IProductDocument } from '../models/product.model';
import { Category } from '../models/category.model';
import { 
  createProductSchema, 
  updateProductSchema, 
  productFilterSchema,
  CreateProductInput, 
  UpdateProductInput,
  ProductFilterInput
} from '../schemas/product.schema';
import { IProductFilter } from '../types/product.interface';
import { AppError } from '../utils/app-error';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Get all products with filtering options
 */
const getProducts = async (filterOptions: ProductFilterInput) => {
  try {
    // Validate filter options
    const validatedFilter = productFilterSchema.parse(filterOptions);
    
    // Build query
    const query: any = {};
    
    // Category filter
    if (validatedFilter.category) {
      // Check if category is an ObjectId or a slug
      if (mongoose.Types.ObjectId.isValid(validatedFilter.category)) {
        query.categoryId = validatedFilter.category;
      } else {
        // Find category by slug
        const category = await Category.findOne({ slug: validatedFilter.category });
        if (category) {
          query.categoryId = category._id;
        } else {
          // If category not found, return empty results
          return {
            products: [],
            total: 0,
            page: validatedFilter.page,
            totalPages: 0,
            limit: validatedFilter.limit
          };
        }
      }
    }
    
    // Price range filter
    if (validatedFilter.minPrice !== undefined || validatedFilter.maxPrice !== undefined) {
      query.price = {};
      if (validatedFilter.minPrice !== undefined) {
        query.price.$gte = validatedFilter.minPrice;
      }
      if (validatedFilter.maxPrice !== undefined) {
        query.price.$lte = validatedFilter.maxPrice;
      }
    }
    
    // Search filter
    if (validatedFilter.search) {
      query.$text = { $search: validatedFilter.search };
    }
    
    // Pagination
    const page = validatedFilter.page || 1;
    const limit = validatedFilter.limit || 10;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    // Return paginated results
    return {
      products,
      total,
      page,
      totalPages,
      limit
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    throw new AppError(`Failed to get products: ${(error as Error).message}`, 500);
  }
};

/**
 * Get product by ID
 */
const getProductById = async (id: string): Promise<IProductDocument> => {
  try {
    const product = await Product.findById(id).populate('categoryId', 'name slug');
    if (!product) {
      throw new AppError(`Product not found with id: ${id}`, 404);
    }
    return product;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid product ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to get product: ${(error as Error).message}`, 500);
  }
};

/**
 * Get product by slug
 */
const getProductBySlug = async (slug: string): Promise<IProductDocument> => {
  try {
    const product = await Product.findOne({ slug }).populate('categoryId', 'name slug');
    if (!product) {
      throw new AppError(`Product not found with slug: ${slug}`, 404);
    }
    return product;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(`Failed to get product: ${(error as Error).message}`, 500);
  }
};

/**
 * Create a new product
 */
const createProduct = async (productData: CreateProductInput): Promise<IProductDocument> => {
  try {
    // Validate data
    const validatedData = createProductSchema.parse(productData);
    
    // Check if category exists
    if (!mongoose.Types.ObjectId.isValid(validatedData.categoryId)) {
      throw new AppError(`Invalid category ID: ${validatedData.categoryId}`, 400);
    }
    
    const category = await Category.findById(validatedData.categoryId);
    if (!category) {
      throw new AppError(`Category not found with id: ${validatedData.categoryId}`, 404);
    }
    
    // Generate slug if not provided
    if (!validatedData.slug && validatedData.name) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug: validatedData.slug });
    if (existingProduct) {
      throw new AppError(`Product with slug '${validatedData.slug}' already exists`, 400);
    }
    
    // Create product
    const product = await Product.create(validatedData);
    
    // Return populated product
    return await Product.findById(product._id).populate('categoryId', 'name slug') as IProductDocument;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error && error.name === 'MongoServerError' && (error as any).code === 11000) {
      throw new AppError('Product with this slug already exists', 400);
    }
    
    throw new AppError(`Failed to create product: ${(error as Error).message}`, 500);
  }
};

/**
 * Update a product
 */
const updateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<IProductDocument> => {
  try {
    // Validate data
    const validatedData = updateProductSchema.parse(productData);
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(`Product not found with id: ${id}`, 404);
    }
    
    // Check if category exists if provided
    if (validatedData.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(validatedData.categoryId)) {
        throw new AppError(`Invalid category ID: ${validatedData.categoryId}`, 400);
      }
      
      const category = await Category.findById(validatedData.categoryId);
      if (!category) {
        throw new AppError(`Category not found with id: ${validatedData.categoryId}`, 404);
      }
    }
    
    // Generate slug if name is updated but slug is not provided
    if (validatedData.name && !validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if slug already exists if provided
    if (validatedData.slug && validatedData.slug !== product.slug) {
      const existingProduct = await Product.findOne({ 
        slug: validatedData.slug,
        _id: { $ne: id }
      });
      
      if (existingProduct) {
        throw new AppError(`Product with slug '${validatedData.slug}' already exists`, 400);
      }
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name slug');
    
    if (!updatedProduct) {
      throw new AppError(`Product not found with id: ${id}`, 404);
    }
    
    return updatedProduct;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid product ID: ${id}`, 400);
    }
    
    if (error instanceof mongoose.Error && error.name === 'MongoServerError' && (error as any).code === 11000) {
      throw new AppError('Product with this slug already exists', 400);
    }
    
    throw new AppError(`Failed to update product: ${(error as Error).message}`, 500);
  }
};

/**
 * Delete a product
 */
const deleteProduct = async (id: string): Promise<void> => {
  try {
    const result = await Product.findByIdAndDelete(id);
    
    if (!result) {
      throw new AppError(`Product not found with id: ${id}`, 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(`Invalid product ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to delete product: ${(error as Error).message}`, 500);
  }
};

export const productService = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};