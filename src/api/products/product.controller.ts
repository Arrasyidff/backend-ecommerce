import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { ProductDto, ProductFilterOptions } from './product.model';
import { productFilterSchema } from './product.validation';

export class ProductController {
  private productService: ProductService;
  
  constructor() {
    this.productService = new ProductService();
  }
  
  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate and parse query parameters
      const { error, value } = productFilterSchema.validate(req.query);
      
      if (error) {
        res.status(400).json({
          status: 'error',
          message: `Invalid query parameters: ${error.message}`
        });
        return;
      }
      
      const filterOptions: ProductFilterOptions = value;
      const result = await this.productService.getAllProducts(filterOptions);
      
      res.status(200).json({
        status: 'success',
        ...result
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: ProductDto = req.body;
      const newProduct = await this.productService.createProduct(productData);
      
      res.status(201).json({
        status: 'success',
        data: { product: newProduct }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const productData: Partial<ProductDto> = req.body;
      const updatedProduct = await this.productService.updateProduct(id, productData);
      
      res.status(200).json({
        status: 'success',
        data: { product: updatedProduct }
      });
    } catch (error) {
      next(error);
    }
  };
  
  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}