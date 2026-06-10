import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

function whereFor(session: { role: string; sub: string }) {
  if (isAdmin(session.role as any)) return { recipientRole: "admin" as string };
  return { recipientRole: session.role, recipientId: session.sub };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [], unread: 0 });
  const where = whereFor(session);
  const [items, unread] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.notification.count({ where: { ...where, read: false } }),
  ]);
  return NextResponse.json({ items, unread });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = whereFor(session);
  const b = await req.json().catch(() => ({}));
  if (b.all) {
    await prisma.notification.updateMany({ where: { ...where, read: false }, data: { read: true } });
  } else if (b.id) {
    await prisma.notification.updateMany({ where: { ...where, id: b.id }, data: { read: true } });
  }
  return NextResponse.json({ ok: true });
}
