import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const user = await prisma.individualUser.findUnique({ where: { email: String(email).trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  await createSession({ sub: user.id, role: "individual", name: user.name, email: user.email });
  return NextResponse.json({ ok: true });
}
