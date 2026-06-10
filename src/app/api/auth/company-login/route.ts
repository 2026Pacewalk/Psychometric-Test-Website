import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { code, password } = await req.json().catch(() => ({}));
  if (!code || !password)
    return NextResponse.json({ error: "Code and password are required." }, { status: 400 });

  const company = await prisma.company.findFirst({
    where: { OR: [{ code: String(code).trim() }, { email: String(code).trim().toLowerCase() }] },
  });
  if (!company || !(await bcrypt.compare(password, company.passwordHash)))
    return NextResponse.json({ error: "Invalid company code or password." }, { status: 401 });

  if (!["approved", "active"].includes(company.status))
    return NextResponse.json(
      { error: `Your company account is "${company.status}". Please contact the administrator.` },
      { status: 403 }
    );

  await createSession({ sub: company.id, role: "company", name: company.name, email: company.email });
  return NextResponse.json({ ok: true });
}
