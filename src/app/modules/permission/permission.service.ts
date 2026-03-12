import { PERMISSIONS } from '../../constants/permissions.js';
import type { HydratedDocument } from 'mongoose';
import type { TUser } from '../user/user.interface.js';
import { userServices } from '../user/user.service.js';

type TAuthUser = HydratedDocument<TUser>;

const getAllPermissions = () => PERMISSIONS;

const getUserPermissions = async (id: string, currentUser: TAuthUser) => {
  return await userServices.getUserPermissions(id, currentUser);
};

const updateUserPermissions = async (
  id: string,
  permissions: string[],
  currentUser: TAuthUser,
) => {
  return await userServices.updateUserPermissions(id, permissions, currentUser);
};

export const PermissionServices = {
  getAllPermissions,
  getUserPermissions,
  updateUserPermissions,
};
