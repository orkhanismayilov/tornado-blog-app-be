import { Router } from 'express';

import { AuthController } from '../controllers';

export const authRoutes = Router();

/**
 * Sign up
 */
authRoutes.post('/signup', AuthController.signup);

/**
 * Login
 */
authRoutes.post('/login', AuthController.login);
