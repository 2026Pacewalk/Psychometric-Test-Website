import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const email = str(b.email).toLowerCase();
  const password = str(b.password);

  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  const exists = await prisma.individualUser.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const user = await prisma.individualUser.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10), phone: str(b.phone), city: str(b.city) },
  });
  await createSession({ sub: user.id, role: "individual", name: user.name, email: user.email });
  return NextResponse.json({ ok: true });
}
