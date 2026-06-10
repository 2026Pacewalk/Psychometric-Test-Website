import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = isAdmin(session.role)
    ? { recipientRole: "admin" }
    : { recipientRole: session.role, recipientId: session.sub };
  await prisma.notification.deleteMany({ where: { ...where, id: params.id } });
  return NextResponse.json({ ok: true });
}
