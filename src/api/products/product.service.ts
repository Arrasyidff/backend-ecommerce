import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';
import { ProductDto, ProductFilterOptions } from './product.model';
import { Prisma } from '@prisma/client';

export class ProductService {
  public async getAllProducts(filterOptions: ProductFilterOptions = {}) {
    try {
      const {
        categoryId,
        name,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc'
      } = filterOptions;
      
      const skip = (page - 1) * limit;
      
      // Build where conditions
      const where: Prisma.ProductWhereInput = {};
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive' // Case insensitive search
        };
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        
        if (minPrice !== undefined) {
          where.price.gte = minPrice;
        }
        
        if (maxPrice !== undefined) {
          where.price.lte = maxPrice;
        }
      }
      
      // Count total before pagination
      const total = await prisma.product.count({ where });
      
      // Get products with pagination, sorting, and filtering
      const products = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order
        }
      });
      
      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      
      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext,
          hasPrev
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to fetch products');
    }
  }

  public async getProductById(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true
        }
      });
      
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      
      return product;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch product');
    }
  }

  public async createProduct(productData: ProductDto) {
    try {
      // Check if the category exists
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId }
      });
      
      if (!category) {
        throw new ApiError(400, 'Category not found');
      }
      
      const newProduct = await prisma.product.create({
        data: productData,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return newProduct;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to create product');
    }
  }

  public async updateProduct(id: string, productData: Partial<ProductDto>) {
    try {
      // Check if the product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!existingProduct) {
        throw new ApiError(404, 'Product not found');
      }
      
      // If categoryId is being updated, check if the category exists
      if (productData.categoryId && productData.categoryId !== existingProduct.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: productData.categoryId }
        });
        
        if (!category) {
          throw new ApiError(400, 'Category not found');
        }
      }
      
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: productData,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return updatedProduct;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to update product');
    }
  }

  public async deleteProduct(id: string) {
    try {
      // Check if the product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!existingProduct) {
        throw new ApiError(404, 'Product not found');
      }
      
      await prisma.product.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete product');
    }
  }
}