import type { HydratedDocument } from 'mongoose';
import type { TUser } from '../app/modules/user/user.interface.js';

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<TUser>;
    }
  }
}

export {};
