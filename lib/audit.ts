import { prisma } from "./prisma";
import { logger } from "./logger";

export interface LogAuditParams {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export async function logAudit({
  userId,
  userEmail,
  action,
  entity,
  entityId,
  metadata,
  ipAddress,
}: LogAuditParams) {
  try {
    const metaString = metadata ? JSON.stringify(metadata) : null;
    await prisma.auditLog.create({
      data: {
        userId: userId || undefined,
        userEmail: userEmail || undefined,
        action,
        entity,
        entityId: entityId || undefined,
        metadata: metaString,
        ipAddress: ipAddress || undefined,
      },
    });

    logger.info(`[AUDIT] ${action} on ${entity} (${entityId || "N/A"})`, {
      userId: userId || undefined,
      action,
      entity,
      entityId: entityId || undefined,
    });
  } catch (error) {
    // Never fail the main operation if audit logging encounters a database hiccup
    logger.error("Failed to write audit log", error, { action, entity, entityId: entityId || undefined });
  }
}
