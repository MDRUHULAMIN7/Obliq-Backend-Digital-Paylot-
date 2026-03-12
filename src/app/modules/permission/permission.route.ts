import express from 'express';
import { PermissionControllers } from './permission.controller.js';
import { verifyToken, checkPermission, checkRole } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { PermissionValidation } from './permission.validation.js';

const router = express.Router();

router.get(
  '/permissions',
  verifyToken,
  checkPermission('users:view'),
  PermissionControllers.getAllPermissions,
);

router.get(
  '/users/:id/permissions',
  verifyToken,
  checkPermission('users:view'),
  PermissionControllers.getUserPermissions,
);

router.patch(
  '/users/:id/permissions',
  verifyToken,
  checkPermission('users:edit'),
  checkRole('admin', 'manager'),
  validateRequest(PermissionValidation.updateUserPermissionsSchema),
  PermissionControllers.updateUserPermissions,
);

export const PermissionRoutes = router;
