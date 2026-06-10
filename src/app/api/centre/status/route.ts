import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CENTRE_STATUS_LABEL } from "@/lib/centre";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const code = String(b.code || "").trim().toUpperCase();
  const email = String(b.email || "").trim().toLowerCase();
  if (!code || !email) return NextResponse.json({ error: "Enter your code and email." }, { status: 400 });

  const centre = await prisma.studyCentre.findFirst({
    where: { code, email },
    include: { joiningPayment: true },
  });
  if (!centre) return NextResponse.json({ error: "No application found for that code + email." }, { status: 404 });

  // Public status lookup intentionally excludes fee / payment / earning details —
  // those are only visible inside the logged-in dashboard.
  return NextResponse.json({
    ok: true,
    name: centre.name,
    code: centre.code,
    status: centre.status,
    statusLabel: CENTRE_STATUS_LABEL[centre.status] || centre.status,
    canLogin: true, // pre-active centres can log in to complete payment
  });
}
