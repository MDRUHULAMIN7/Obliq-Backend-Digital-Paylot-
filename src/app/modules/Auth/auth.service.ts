import type { TLoginUser } from './auth.interface.js';
import { User } from '../user/user.model.js';
import AppError from '../../errors/AppError.js';
import { StatusCodes } from 'http-status-codes';
import config from '../../config/index.js';
import { createToken, verifyToken } from './auth.utils.js';
import type { JwtPayload } from 'jsonwebtoken';
import { TokenBlacklist } from './tokenBlacklist.model.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const loginUser = async (payload: TLoginUser) => {
  const email = payload.email.toLowerCase();
  const user = await User.findByEmailWithPassword(email);

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials!');
  }

  if (user.status !== 'active') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not active!');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials!');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    permissions: user.permissions ?? [],
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    ACCESS_TOKEN_EXPIRES_IN,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    REFRESH_TOKEN_EXPIRES_IN,
  );

  const safeUser = await User.findById(user._id).select('-password');

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is required!');
  }

  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is invalid!');
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userId } = decoded as JwtPayload;

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token!');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }

  if (user.status !== 'active') {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not active!');
  }

  const accessToken = createToken(
    {
      userId: user._id.toString(),
      role: user.role,
      permissions: user.permissions ?? [],
    },
    config.jwt_access_secret as string,
    ACCESS_TOKEN_EXPIRES_IN,
  );

  return {
    accessToken,
  };
};

const logout = async (token?: string) => {
  if (!token) {
    return;
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { exp } = decoded as JwtPayload;

  const expiresAt = exp ? new Date(exp * 1000) : new Date();

  await TokenBlacklist.updateOne(
    { token },
    { token, expiresAt },
    { upsert: true },
  );
};

export const AuthServices = {
  loginUser,
  refreshToken,
  logout,
};
