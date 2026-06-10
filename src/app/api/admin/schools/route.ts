import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  const g = await guardAdmin("schools");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const code = str(b.code).toUpperCase();
  const email = str(b.email).toLowerCase();
  const password = str(b.password);

  if (!name || !code || !email || !password)
    return NextResponse.json({ error: "Name, code, email and password are required." }, { status: 400 });

  const exists = await prisma.school.findFirst({ where: { OR: [{ code }, { email }] } });
  if (exists) return NextResponse.json({ error: "A school with this code or email already exists." }, { status: 409 });

  const school = await prisma.school.create({
    data: {
      name,
      code,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      phone: str(b.phone),
      city: str(b.city),
      state: str(b.state),
      address: str(b.address),
      principal: str(b.principal),
      status: str(b.status) || "approved",
    },
  });
  return NextResponse.json({ ok: true, id: school.id });
}
