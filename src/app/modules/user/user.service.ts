import { StatusCodes } from 'http-status-codes';
import { User } from './user.model.js';
import AppError from '../../errors/AppError.js';
import type { HydratedDocument } from 'mongoose';
import type { TUser } from './user.interface.js';
import { PERMISSIONS } from '../../constants/permissions.js';

type TAuthUser = HydratedDocument<TUser>;

const ensureManagerAccess = (currentUser: TAuthUser, targetUser: TAuthUser) => {
  if (currentUser.role !== 'manager') {
    return;
  }

  const isOwned =
    targetUser.createdBy?.toString() === currentUser._id.toString();
  const roleAllowed = ['agent', 'customer'].includes(targetUser.role);

  if (!isOwned || !roleAllowed) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Manager can only manage their own agents/customers.',
    );
  }
};

const createUser = async (payload: Partial<TUser>, currentUser: TAuthUser) => {
  if (currentUser.role === 'manager') {
    if (!payload.role || !['agent', 'customer'].includes(payload.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Manager can only create agents/customers.',
      );
    }
  }

  if (payload.permissions && currentUser.role !== 'admin') {
    const invalidPermissions = payload.permissions.filter(
      (permission) => !currentUser.permissions?.includes(permission),
    );

    if (invalidPermissions.length) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You cannot grant permissions you do not have.',
      );
    }
  }

  const userData: Partial<TUser> = {
    name: payload.name,
    email: payload.email?.toLowerCase(),
    password: payload.password,
    role: payload.role,
    status: payload.status ?? 'active',
    permissions: payload.permissions ?? [],
    createdBy: currentUser.role === 'manager' ? currentUser._id : payload.createdBy,
  };

  const createdUser = await User.create(userData);
  const safeUser = await User.findById(createdUser._id).select('-password');
  return safeUser;
};

const getUsers = async (
  filters: { role?: string; status?: string },
  currentUser: TAuthUser,
) => {
  const query: Record<string, unknown> = {};

  if (currentUser.role === 'manager') {
    query.createdBy = currentUser._id;

    if (filters.role) {
      if (!['agent', 'customer'].includes(filters.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          'Manager can only view agents/customers.',
        );
      }
      query.role = filters.role;
    } else {
      query.role = { $in: ['agent', 'customer'] };
    }
  } else if (filters.role) {
    query.role = filters.role;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return await User.find(query).select('-password').sort({ createdAt: -1 });
};

const getUserById = async (id: string, currentUser: TAuthUser) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user);
  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<TUser>,
  currentUser: TAuthUser,
) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user);

  if (currentUser.role === 'manager' && payload.role) {
    if (!['agent', 'customer'].includes(payload.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Manager can only assign agent/customer roles.',
      );
    }
  }

  const updateData: Partial<TUser> = {
    name: payload.name,
    email: payload.email?.toLowerCase(),
    role: payload.role,
  };

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return updatedUser;
};

const suspendUser = async (id: string, currentUser: TAuthUser) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user);

  return await User.findByIdAndUpdate(
    id,
    { status: 'suspended' },
    { new: true },
  ).select('-password');
};

const banUser = async (id: string, currentUser: TAuthUser) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user);

  return await User.findByIdAndUpdate(
    id,
    { status: 'banned' },
    { new: true },
  ).select('-password');
};

const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return deletedUser;
};

const getUserPermissions = async (id: string, currentUser: TAuthUser) => {
  const user = await User.findById(id).select('permissions role createdBy');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user as TAuthUser);

  return user.permissions;
};

const updateUserPermissions = async (
  id: string,
  permissions: string[],
  currentUser: TAuthUser,
) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  ensureManagerAccess(currentUser, user);

  const grantablePermissions =
    currentUser.role === 'admin' ? PERMISSIONS : currentUser.permissions || [];

  const invalidPermissions = permissions.filter(
    (permission) => !grantablePermissions.includes(permission),
  );

  if (invalidPermissions.length) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You cannot grant permissions you do not have.',
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { permissions },
    { new: true, runValidators: true },
  ).select('-password');

  return updatedUser;
};

export const userServices = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  suspendUser,
  banUser,
  deleteUser,
  getUserPermissions,
  updateUserPermissions,
};
