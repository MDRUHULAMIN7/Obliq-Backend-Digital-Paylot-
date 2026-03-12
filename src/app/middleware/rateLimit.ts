import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError.js';

type RateEntry = {
  count: number;
  resetAt: number;
};

const loginAttempts = new Map<string, RateEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const loginRateLimiter = (req, _res, next) => {
  const email = req.body?.email?.toLowerCase?.() ?? '';
  const key = `${req.ip}:${email}`;
  const now = Date.now();
  const existing = loginAttempts.get(key);

  if (!existing || existing.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (existing.count >= MAX_ATTEMPTS) {
    throw new AppError(
      StatusCodes.TOO_MANY_REQUESTS,
      'Too many login attempts. Please try again later.',
    );
  }

  existing.count += 1;
  loginAttempts.set(key, existing);
  next();
};
