import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/CatchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuditServices } from './audit.service.js';

const getLogs = catchAsync(async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const result = await AuditServices.getLogs(page, limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Audit logs retrieved successfully!',
    data: result,
  });
});

export const AuditControllers = {
  getLogs,
};
