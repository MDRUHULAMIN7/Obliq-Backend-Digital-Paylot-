import express from 'express';
import { AuthValidation } from './auth.validation.js';
import { AuthControllers } from './auth.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { verifyToken } from '../../middleware/auth.js';
import { loginRateLimiter } from '../../middleware/rateLimit.js';

const router = express.Router();

router.post(
  '/login',
  loginRateLimiter,
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post('/logout', AuthControllers.logout);

router.get('/me', verifyToken, AuthControllers.getMe);

export const AuthRoutes = router;
