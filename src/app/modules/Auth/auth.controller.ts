import { StatusCodes } from 'http-status-codes';
import config from '../../config/index.js';
import catchAsync from '../../utils/CatchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuthServices } from './auth.service.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      user,
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  await AuthServices.logout(refreshToken);

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged out successfully!',
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  logout,
};
