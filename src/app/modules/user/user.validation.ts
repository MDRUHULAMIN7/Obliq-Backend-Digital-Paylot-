import { z } from 'zod';
import { UserStatus, USER_ROLE } from './user.constant.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Valid email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password can not be less than 6 characters' })
      .max(20, { message: 'Password can not be more than 20 characters' }),
    role: z.enum([...Object.values(USER_ROLE)] as [string, ...string[]]),
    permissions: z
      .array(z.enum([...PERMISSIONS] as [string, ...string[]]))
      .optional(),
    status: z.enum([...UserStatus] as [string, ...string[]]).optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      role: z.enum([...Object.values(USER_ROLE)] as [string, ...string[]]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
});

const updateStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateStatusValidationSchema,
};
