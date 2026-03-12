import { AuditLog } from './audit.model.js';

type TLogActionPayload = {
  action: string;
  performedBy: string;
  targetUser?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
};

const logAction = async (payload: TLogActionPayload) => {
  await AuditLog.create({
    action: payload.action,
    performedBy: payload.performedBy,
    targetUser: payload.targetUser,
    details: payload.details,
    ipAddress: payload.ipAddress,
  });
};

const getLogs = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role'),
    AuditLog.countDocuments(),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: logs,
  };
};

export const AuditServices = {
  logAction,
  getLogs,
};
