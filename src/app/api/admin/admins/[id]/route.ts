import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { PERMISSIONS } from "@/lib/permissions";

const ROLES = ["superadmin", "admin", "viewer"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("admins");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof b.name === "string") data.name = b.name.trim();
  if (ROLES.includes(b.role)) data.role = b.role;
  if (typeof b.active === "boolean") data.active = b.active;
  if (Array.isArray(b.permissions))
    data.permissions = JSON.stringify(
      b.permissions.filter((p: string) => (PERMISSIONS as readonly string[]).includes(p))
    );
  if (b.password) data.passwordHash = await bcrypt.hash(String(b.password), 10);

  await prisma.adminUser.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("admins");
  if ("error" in g) return g.error;
  if (g.session.sub === params.id)
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  await prisma.adminUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
