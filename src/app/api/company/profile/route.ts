import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "company")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const data: Record<string, unknown> = {
    name: str(b.name), phone: str(b.phone), city: str(b.city), state: str(b.state),
    contactPerson: str(b.contactPerson), industry: str(b.industry),
  };
  if (b.newPassword) {
    const company = await prisma.company.findUnique({ where: { id: session.sub } });
    if (!company || !(await bcrypt.compare(String(b.currentPassword || ""), company.passwordHash)))
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    if (String(b.newPassword).length < 6)
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    data.passwordHash = await bcrypt.hash(String(b.newPassword), 10);
  }
  await prisma.company.update({ where: { id: session.sub }, data });
  return NextResponse.json({ ok: true });
}
