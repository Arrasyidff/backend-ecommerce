import { Router } from 'express';
import authRoutes from '../api/auth/auth.routes';
import userRoutes from '../api/users/user.routes';
import categoryRoutes from '../api/categories/category.routes';
import productRoutes from '../api/products/product.routes';
import cartRoutes from '../api/carts/cart.routes';
import orderRoutes from '../api/orders/order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;