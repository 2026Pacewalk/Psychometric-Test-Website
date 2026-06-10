import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { CENTRE_STATUSES } from "@/lib/centre";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const data: Record<string, unknown> = {
    name: str(b.name), ownerName: str(b.ownerName), mobile: str(b.mobile),
    city: str(b.city), district: str(b.district), state: str(b.state), address: str(b.address),
  };
  if (b.status && CENTRE_STATUSES.includes(b.status)) data.status = b.status;
  if (typeof b.commissionPercent === "number" && b.commissionPercent >= 0 && b.commissionPercent <= 100)
    data.commissionPercent = Math.round(b.commissionPercent);
  if (b.password) data.passwordHash = await bcrypt.hash(String(b.password), 10);

  await prisma.studyCentre.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;
  await prisma.studyCentre.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
