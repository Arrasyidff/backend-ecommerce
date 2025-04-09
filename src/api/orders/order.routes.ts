// src/api/orders/order.routes.ts
import { Router } from 'express';
import { OrderController } from './order.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { checkoutSchema, updateOrderStatusSchema } from './order.validation';

const router = Router();
const orderController = new OrderController();
const authMiddleware = new AuthMiddleware();

// All order routes require authentication
router.use(authMiddleware.authenticate);

// User order routes
router.post('/checkout', validationMiddleware(checkoutSchema), orderController.checkout);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Admin only routes
router.get('/admin/all', authMiddleware.authorize(['ADMIN']), orderController.getAllOrders);
router.put(
  '/:id/status',
  authMiddleware.authorize(['ADMIN']),
  validationMiddleware(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;