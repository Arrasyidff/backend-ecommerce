import { Router } from 'express';
import { ProductController } from './product.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { createProductSchema, updateProductSchema } from './product.validation';

const router = Router();
const productController = new ProductController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  productController.deleteProduct
);

export default router;