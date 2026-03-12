import type { Model, Types, HydratedDocument } from 'mongoose';
import type { USER_ROLE } from './user.constant.js';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'agent' | 'customer';
  status: 'active' | 'suspended' | 'banned';
  permissions: string[];
  createdBy?: Types.ObjectId;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  findByEmailWithPassword(
    email: string,
  ): Promise<HydratedDocument<TUser> | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
