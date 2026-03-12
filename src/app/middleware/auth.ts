
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import config from '../config/index.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model.js';
import type { TUserRole } from '../modules/user/user.interface.js';
import type { PermissionAtom } from '../constants/permissions.js';

export const verifyToken = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;
  const cookieToken = req.cookies?.accessToken;
  const token = headerToken || cookieToken;

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token!');
  }

  const { userId } = decoded;
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token payload!');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  if (user.status !== 'active') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not active!');
  }

  req.user = user;
  next();
});

export const checkPermission = (atom: PermissionAtom) => {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    if (user.role === 'admin') {
      return next();
    }

    if (!user.permissions?.includes(atom)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Permission denied!');
    }

    next();
  };
};

export const checkRole = (...roles: TUserRole[]) => {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    if (!roles.includes(user.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized!');
    }

    next();
  };
};
