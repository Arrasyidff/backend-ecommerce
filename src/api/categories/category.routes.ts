import { Router } from 'express';
import { CategoryController } from './category.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { createCategorySchema, updateCategorySchema } from './category.validation';

const router = Router();
const categoryController = new CategoryController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['ADMIN']),
  categoryController.deleteCategory
);

export default router;