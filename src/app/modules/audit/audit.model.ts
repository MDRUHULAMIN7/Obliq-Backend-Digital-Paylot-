import { model, Schema } from 'mongoose';

type TAuditLog = {
  action: string;
  performedBy: Schema.Types.ObjectId;
  targetUser?: Schema.Types.ObjectId;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
};

const auditLogSchema = new Schema<TAuditLog>({
  action: {
    type: String,
    required: true,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  details: {
    type: Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const AuditLog = model<TAuditLog>('AuditLog', auditLogSchema);
