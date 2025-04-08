import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validationMiddleware(registerSchema), authController.register);
router.post('/login', validationMiddleware(loginSchema), authController.login);

export default router;