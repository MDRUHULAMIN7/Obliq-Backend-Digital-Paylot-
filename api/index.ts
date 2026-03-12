import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app.js';
import connectDB from '../src/app/utils/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res);
}
