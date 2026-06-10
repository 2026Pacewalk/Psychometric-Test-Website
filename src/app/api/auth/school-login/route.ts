import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { code, password } = await req.json().catch(() => ({}));
  if (!code || !password) {
    return NextResponse.json({ error: "Code and password are required." }, { status: 400 });
  }

  const school = await prisma.school.findFirst({
    where: { OR: [{ code: String(code).trim() }, { email: String(code).trim().toLowerCase() }] },
  });
  if (!school || !(await bcrypt.compare(password, school.passwordHash))) {
    return NextResponse.json({ error: "Invalid school code or password." }, { status: 401 });
  }

  const allowed = ["approved", "active"];
  if (!allowed.includes(school.status)) {
    return NextResponse.json(
      { error: `Your school account is "${school.status}". Please contact the administrator.` },
      { status: 403 }
    );
  }

  await createSession({ sub: school.id, role: "school", name: school.name, email: school.email });
  return NextResponse.json({ ok: true });
}
