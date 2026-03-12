import express from 'express';
import { AuditControllers } from './audit.controller.js';
import { verifyToken, checkPermission, checkRole } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/',
  verifyToken,
  checkPermission('audit:view'),
  checkRole('admin'),
  AuditControllers.getLogs,
);

export const AuditRoutes = router;
