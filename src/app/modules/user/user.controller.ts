import sendResponse from '../../utils/sendResponse.js';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/CatchAsync.js';
import { userServices } from './user.service.js';
import { AuditServices } from '../audit/audit.service.js';
import AppError from '../../errors/AppError.js';

const getCurrentUser = (req) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }
  return currentUser;
};

const createUser = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.createUser(req.body, currentUser);

  await AuditServices.logAction({
    action: 'users:create',
    performedBy: currentUser._id.toString(),
    targetUser: result?._id?.toString(),
    details: { role: result?.role, email: result?.email },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const { role, status } = req.query;
  const result = await userServices.getUsers(
    {
      role: role?.toString(),
      status: status?.toString(),
    },
    currentUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.getUserById(req.params.id, currentUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.updateUser(
    req.params.id,
    req.body,
    currentUser,
  );

  await AuditServices.logAction({
    action: 'users:update',
    performedBy: currentUser._id.toString(),
    targetUser: req.params.id,
    details: { updates: req.body },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const suspendUser = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.suspendUser(req.params.id, currentUser);

  await AuditServices.logAction({
    action: 'users:suspend',
    performedBy: currentUser._id.toString(),
    targetUser: req.params.id,
    details: { status: 'suspended' },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User suspended successfully',
    data: result,
  });
});

const banUser = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.banUser(req.params.id, currentUser);

  await AuditServices.logAction({
    action: 'users:ban',
    performedBy: currentUser._id.toString(),
    targetUser: req.params.id,
    details: { status: 'banned' },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User banned successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const currentUser = getCurrentUser(req);
  const result = await userServices.deleteUser(req.params.id);

  await AuditServices.logAction({
    action: 'users:delete',
    performedBy: currentUser._id.toString(),
    targetUser: req.params.id,
    details: { deleted: true },
    ipAddress: req.ip,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userControllers = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  suspendUser,
  banUser,
  deleteUser,
};
