import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { normalizeLang } from "@/lib/i18n";

// Persists the logged-in account's preferred report language.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }); // public/sample views: no-op

  const b = await req.json().catch(() => ({}));
  const reportLang = normalizeLang(b.lang);

  try {
    if (session.role === "school") await prisma.school.update({ where: { id: session.sub }, data: { reportLang } });
    else if (session.role === "company") await prisma.company.update({ where: { id: session.sub }, data: { reportLang } });
    else if (session.role === "centre") await prisma.studyCentre.update({ where: { id: session.sub }, data: { reportLang } });
    else if (session.role === "individual") await prisma.individualUser.update({ where: { id: session.sub }, data: { reportLang } });
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
