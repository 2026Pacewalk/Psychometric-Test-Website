import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function PATCH(req: NextRequest, { params }: { params: { type: string } }) {
  const g = await guardAdmin("careers");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  await prisma.careerSuggestion.update({
    where: { type: params.type },
    data: { label: str(b.label), fields: str(b.fields), traits: str(b.traits), formula: str(b.formula) },
  });
  return NextResponse.json({ ok: true });
}
