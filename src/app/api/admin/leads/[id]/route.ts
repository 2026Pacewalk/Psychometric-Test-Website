import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

const STATUSES = ["new", "contacted", "converted", "closed"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof b.status === "string" && STATUSES.includes(b.status)) data.status = b.status;
  if (typeof b.read === "boolean") data.read = b.read;
  await prisma.lead.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;
  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
