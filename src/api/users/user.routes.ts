import { Router } from 'express';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.get('/', 
  authMiddleware.authenticate, 
  authMiddleware.authorize(['ADMIN']), 
  userController.getAllUsers
);

export default router;