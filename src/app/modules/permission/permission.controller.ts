import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/CatchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { PermissionServices } from './permission.service.js';
import { AuditServices } from '../audit/audit.service.js';
import AppError from '../../errors/AppError.js';

const getAllPermissions = catchAsync(async (_req, res) => {
  const result = PermissionServices.getAllPermissions();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Permissions retrieved successfully!',
    data: result,
  });
});

const getUserPermissions = catchAsync(async (req, res) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await PermissionServices.getUserPermissions(
    req.params.id,
    currentUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User permissions retrieved successfully!',
    data: result,
  });
});

const updateUserPermissions = catchAsync(async (req, res) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await PermissionServices.updateUserPermissions(
    req.params.id,
    req.body.permissions,
    currentUser,
  );

  await AuditServices.logAction({
    action: 'permissions:update',
    performedBy: currentUser._id.toString(),
    targetUser: req.params.id,
    details: { permissions: req.body.permissions },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User permissions updated successfully!',
    data: result,
  });
});

export const PermissionControllers = {
  getAllPermissions,
  getUserPermissions,
  updateUserPermissions,
};
