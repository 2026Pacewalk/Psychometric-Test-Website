import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { SKILLS } from "@/lib/skills";

const SKILL_KEYS = SKILLS.map((s) => s.key) as string[];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("questions");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof b.textEn === "string") data.textEn = b.textEn.trim();
  if (typeof b.textPa === "string") data.textPa = b.textPa.trim();
  if (typeof b.skill === "string" && SKILL_KEYS.includes(b.skill)) data.skill = b.skill;
  if (typeof b.reverse === "boolean") data.reverse = b.reverse;
  if (typeof b.active === "boolean") data.active = b.active;

  await prisma.question.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}
