import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/AppError.js";
import config from "../config/index.js";

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header("x-admin-key");
  if (!config.admin_key || !key || key !== config.admin_key) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  next();
};

export default adminOnly;
