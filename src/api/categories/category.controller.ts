import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.model';

export class CategoryController {
  private categoryService: CategoryService;
  
  constructor() {
    this.categoryService = new CategoryService();
  }
  
  public getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      
      res.status(200).json({
        status: 'success',
        data: { categories }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);
      
      res.status(200).json({
        status: 'success',
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData: CategoryDto = req.body;
      const newCategory = await this.categoryService.createCategory(categoryData);
      
      res.status(201).json({
        status: 'success',
        data: { category: newCategory }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryData: Partial<CategoryDto> = req.body;
      const updatedCategory = await this.categoryService.updateCategory(id, categoryData);
      
      res.status(200).json({
        status: 'success',
        data: { category: updatedCategory }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}