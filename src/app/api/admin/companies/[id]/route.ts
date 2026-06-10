import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

const STATUSES = ["pending", "approved", "rejected", "suspended", "active", "inactive"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("companies");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const data: Record<string, unknown> = {
    name: str(b.name), phone: str(b.phone), city: str(b.city), state: str(b.state),
    contactPerson: str(b.contactPerson), industry: str(b.industry),
  };
  if (b.status && STATUSES.includes(b.status)) data.status = b.status;
  if (b.password) data.passwordHash = await bcrypt.hash(String(b.password), 10);
  await prisma.company.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("companies");
  if ("error" in g) return g.error;
  await prisma.company.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
