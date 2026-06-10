import { NextRequest } from "next/server";
import { prisma } from "./db";
import { SessionPayload } from "./auth";

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function logAudit(opts: {
  session?: SessionPayload | null;
  action: string;
  entity?: string;
  entityId?: string;
  details?: unknown;
  ip?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorRole: opts.session?.role || null,
        actorId: opts.session?.sub || null,
        actorName: opts.session?.name || null,
        action: opts.action,
        entity: opts.entity || null,
        entityId: opts.entityId || null,
        details: opts.details ? JSON.stringify(opts.details) : null,
        ip: opts.ip || null,
      },
    });
  } catch {
    /* never block the main flow on audit failure */
  }
}
