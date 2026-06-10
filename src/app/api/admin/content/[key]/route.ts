import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  const g = await guardAdmin("content");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const title = typeof b.title === "string" ? b.title : "";
  const body = typeof b.body === "string" ? b.body : "";
  await prisma.contentBlock.upsert({
    where: { key: params.key },
    update: { title, body },
    create: { key: params.key, title, body },
  });
  return NextResponse.json({ ok: true });
}
