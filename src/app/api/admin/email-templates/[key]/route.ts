import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  const g = await guardAdmin("content");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof b.subject === "string") data.subject = b.subject;
  if (typeof b.body === "string") data.body = b.body;
  await prisma.emailTemplate.update({ where: { key: params.key }, data });
  return NextResponse.json({ ok: true });
}
