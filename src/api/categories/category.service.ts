import { prisma } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database-error';
import { ApiError } from '../../utils/errors/api-error';
import { CategoryDto } from './category.model';

export class CategoryService {
  public async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      
      return categories;
    } catch (error) {
      throw new DatabaseError('Failed to fetch categories');
    }
  }

  public async getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true
        }
      });
      
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      
      return category;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to fetch category');
    }
  }

  public async createCategory(categoryData: CategoryDto) {
    try {
      // Check if category with this name already exists
      const existingCategory = await prisma.category.findUnique({
        where: { name: categoryData.name }
      });
      
      if (existingCategory) {
        throw new ApiError(400, 'Category with this name already exists');
      }
      
      const newCategory = await prisma.category.create({
        data: categoryData
      });
      
      return newCategory;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to create category');
    }
  }

  public async updateCategory(id: string, categoryData: Partial<CategoryDto>) {
    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id }
      });
      
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }
      
      // Check if name is being updated and if it's already taken
      if (categoryData.name && categoryData.name !== existingCategory.name) {
        const categoryWithName = await prisma.category.findUnique({
          where: { name: categoryData.name }
        });
        
        if (categoryWithName) {
          throw new ApiError(400, 'Category with this name already exists');
        }
      }
      
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: categoryData
      });
      
      return updatedCategory;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to update category');
    }
  }

  public async deleteCategory(id: string) {
    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            select: {
              id: true
            }
          }
        }
      });
      
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }
      
      // Check if there are products in this category
      if (existingCategory.products.length > 0) {
        throw new ApiError(400, 'Cannot delete category with existing products');
      }
      
      await prisma.category.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete category');
    }
  }
}