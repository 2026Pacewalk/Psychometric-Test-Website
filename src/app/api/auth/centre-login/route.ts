import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { code, password } = await req.json().catch(() => ({}));
  if (!code || !password)
    return NextResponse.json({ error: "Code and password are required." }, { status: 400 });

  const centre = await prisma.studyCentre.findFirst({
    where: { OR: [{ code: String(code).trim().toUpperCase() }, { email: String(code).trim().toLowerCase() }] },
  });
  if (!centre || !centre.passwordHash || !(await bcrypt.compare(password, centre.passwordHash)))
    return NextResponse.json({ error: "Invalid centre code or password." }, { status: 401 });

  // Blocked states cannot log in. Pre-active states CAN log in so they can pay
  // the joining fee from their dashboard.
  if (["rejected", "suspended"].includes(centre.status))
    return NextResponse.json(
      { error: `Your study centre account is "${centre.status}". Please contact the administrator.` },
      { status: 403 }
    );

  await createSession({ sub: centre.id, role: "centre", name: centre.name, email: centre.email });
  return NextResponse.json({ ok: true });
}
