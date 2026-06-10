import { prisma } from "./db";
import { Role } from "./auth";

// Map a session role to the notification "recipientRole".
export function notifRole(role: Role): string {
  if (role === "superadmin" || role === "admin" || role === "viewer") return "admin";
  return role;
}

async function create(data: {
  recipientRole: string; recipientId?: string | null; type: string; title: string; body?: string; link?: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        recipientRole: data.recipientRole,
        recipientId: data.recipientId ?? null,
        type: data.type,
        title: data.title,
        body: data.body ?? null,
        link: data.link ?? null,
      },
    });
  } catch {
    /* never block the main flow on notification failure */
  }
}

// To all admins (super admin inbox).
export function notifyAdmin(type: string, title: string, body?: string, link?: string) {
  return create({ recipientRole: "admin", recipientId: null, type, title, body, link });
}

// To a specific account (school/company/centre/individual).
export function notifyUser(role: "school" | "company" | "centre" | "individual", id: string, type: string, title: string, body?: string, link?: string) {
  return create({ recipientRole: role, recipientId: id, type, title, body, link });
}
