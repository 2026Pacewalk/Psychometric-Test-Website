import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("individuals");
  if ("error" in g) return g.error;
  await prisma.individualUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
