import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "centre")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const data: Record<string, unknown> = {
    name: str(b.name), ownerName: str(b.ownerName), mobile: str(b.mobile),
    city: str(b.city), district: str(b.district), state: str(b.state), address: str(b.address),
  };
  if (b.newPassword) {
    const centre = await prisma.studyCentre.findUnique({ where: { id: session.sub } });
    if (!centre || !centre.passwordHash || !(await bcrypt.compare(String(b.currentPassword || ""), centre.passwordHash)))
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    if (String(b.newPassword).length < 6)
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    data.passwordHash = await bcrypt.hash(String(b.newPassword), 10);
  }
  await prisma.studyCentre.update({ where: { id: session.sub }, data });
  return NextResponse.json({ ok: true });
}
