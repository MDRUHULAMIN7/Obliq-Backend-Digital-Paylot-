import { z } from 'zod';
import { PERMISSIONS } from '../../constants/permissions.js';

const updateUserPermissionsSchema = z.object({
  body: z.object({
    permissions: z.array(
      z.enum([...PERMISSIONS] as [string, ...string[]]),
    ),
  }),
});

export const PermissionValidation = {
  updateUserPermissionsSchema,
};
