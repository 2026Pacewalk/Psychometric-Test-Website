import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { PERMISSIONS } from "@/lib/permissions";

const ROLES = ["superadmin", "admin", "viewer"];

export async function POST(req: NextRequest) {
  const g = await guardAdmin("admins");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const email = str(b.email).toLowerCase();
  const password = str(b.password);
  const role = ROLES.includes(b.role) ? b.role : "admin";
  const perms = Array.isArray(b.permissions)
    ? b.permissions.filter((p: string) => (PERMISSIONS as readonly string[]).includes(p))
    : [];

  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  const exists = await prisma.adminUser.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "An admin with this email exists." }, { status: 409 });

  await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role,
      permissions: JSON.stringify(perms),
      active: true,
    },
  });
  return NextResponse.json({ ok: true });
}
