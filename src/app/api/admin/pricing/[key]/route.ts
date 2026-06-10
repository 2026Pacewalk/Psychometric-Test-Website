import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  const g = await guardAdmin("pricing");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof b.label === "string") data.label = b.label.trim();
  if (typeof b.amount === "number" && b.amount >= 0) data.amount = Math.round(b.amount);
  if (typeof b.active === "boolean") data.active = b.active;
  await prisma.pricing.update({ where: { key: params.key }, data });
  return NextResponse.json({ ok: true });
}
