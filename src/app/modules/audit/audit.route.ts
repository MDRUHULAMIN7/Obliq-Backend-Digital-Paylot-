import express from 'express';
import { AuditControllers } from './audit.controller.js';
import { verifyToken, checkPermission } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/',
  verifyToken,
  checkPermission('audit:view'),
  AuditControllers.getLogs,
);

export const AuditRoutes = router;
