import express from 'express';
import { AuthValidation } from './auth.validation.js';
import { AuthControllers } from './auth.controller.js';
import validateRequest from '../../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post('/logout', AuthControllers.logout);

export const AuthRoutes = router;
