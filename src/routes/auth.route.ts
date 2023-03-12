import { AuthController } from '@tba/controllers';

import { Router } from 'express';

export const authRoutes = Router();

/**
 * Sign up
 */
authRoutes.post('/signup', AuthController.signup);

/**
 * Login
 */
authRoutes.post('/login', AuthController.login);
