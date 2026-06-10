import { NextResponse } from "next/server";
import { getSession, isAdmin } from "./auth";
import { prisma } from "./db";
import { effectivePermissions, Permission } from "./permissions";

// Returns the admin session if authorized for `perm`, otherwise a NextResponse error.
export async function guardAdmin(perm?: Permission) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (perm) {
    let perms: Permission[];
    if (session.role === "superadmin") {
      perms = effectivePermissions("superadmin", null);
    } else {
      const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
      perms = effectivePermissions(session.role, user?.permissions);
    }
    if (!perms.includes(perm)) {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
  }
  return { session };
}
