import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { AuthRoutes } from '../modules/Auth/auth.route.js';
import { PermissionRoutes } from '../modules/permission/permission.route.js';
import { AuditRoutes } from '../modules/audit/audit.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/',
    route: PermissionRoutes,
  },
  {
    path: '/audit',
    route: AuditRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
