import { Router } from 'express';
import authRoutes from '../api/auth/auth.routes';
import userRoutes from '../api/users/user.routes';
import categoryRoutes from '../api/categories/category.routes';
import productRoutes from '../api/products/product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;