// src/api/carts/cart.routes.ts
import { Router } from 'express';
import { CartController } from './cart.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { addToCartSchema, updateCartItemSchema } from './cart.validation';

const router = Router();
const cartController = new CartController();
const authMiddleware = new AuthMiddleware();

// All cart routes require authentication
router.use(authMiddleware.authenticate);

// Cart routes
router.get('/', cartController.getCart);
router.post('/', validationMiddleware(addToCartSchema), cartController.addToCart);
router.put('/:id', validationMiddleware(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;