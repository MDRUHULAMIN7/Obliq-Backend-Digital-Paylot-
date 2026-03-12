import express from 'express';
import { userControllers } from './user.controller.js';
import { verifyToken, checkPermission, checkRole } from '../../middleware/auth.js';
import { UserValidation } from './user.validation.js';
import validateRequest from '../../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  checkPermission('users:create'),
  checkRole('admin', 'manager'),
  validateRequest(UserValidation.createUserValidationSchema),
  userControllers.createUser,
);

router.get(
  '/',
  verifyToken,
  checkPermission('users:view'),
  userControllers.getUsers,
);

router.get(
  '/:id',
  verifyToken,
  checkPermission('users:view'),
  userControllers.getUserById,
);

router.patch(
  '/:id',
  verifyToken,
  checkPermission('users:edit'),
  validateRequest(UserValidation.updateUserValidationSchema),
  userControllers.updateUser,
);

router.patch(
  '/:id/suspend',
  verifyToken,
  checkPermission('users:suspend'),
  userControllers.suspendUser,
);

router.patch(
  '/:id/ban',
  verifyToken,
  checkPermission('users:ban'),
  userControllers.banUser,
);

router.delete(
  '/:id',
  verifyToken,
  checkPermission('users:ban'),
  checkRole('admin'),
  userControllers.deleteUser,
);

export const UserRoutes = router;
