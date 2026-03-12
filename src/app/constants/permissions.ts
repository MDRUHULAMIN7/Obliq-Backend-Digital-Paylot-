export const PERMISSIONS = [
  'dashboard:view',
  'leads:view',
  'leads:create',
  'leads:edit',
  'leads:delete',
  'tasks:view',
  'tasks:create',
  'tasks:edit',
  'tasks:delete',
  'reports:view',
  'users:view',
  'users:create',
  'users:edit',
  'users:suspend',
  'users:ban',
  'audit:view',
  'settings:view',
  'customer_portal:view',
] as const;

export type PermissionAtom = (typeof PERMISSIONS)[number];
