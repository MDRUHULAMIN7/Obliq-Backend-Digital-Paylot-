import { model, Schema } from 'mongoose';

type TTokenBlacklist = {
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

const tokenBlacklistSchema = new Schema<TTokenBlacklist>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TokenBlacklist = model<TTokenBlacklist>(
  'TokenBlacklist',
  tokenBlacklistSchema,
);
