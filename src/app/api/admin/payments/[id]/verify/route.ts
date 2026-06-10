import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { notifyUser } from "@/lib/notify";
import { logAudit, clientIp } from "@/lib/audit";

function receiptNo(seq: number) {
  return `AMG/TP/${new Date().getFullYear()}/${String(seq).padStart(4, "0")}`;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("payments");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const action = b.action === "reject" ? "reject" : b.action === "approve" ? "approve" : null;
  if (!action) return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  const remarks = typeof b.remarks === "string" ? b.remarks.trim() : undefined;

  const payment = await prisma.payment.findUnique({ where: { id: params.id }, include: { session: true } });
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  if (action === "reject") {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "rejected", remarks, approvedBy: g.session.name, approvedAt: new Date() } });
    await notifyUser("individual", payment.individualUserId, "payment_rejected", "Payment not approved", remarks || "Please contact support.", "/individual/account");
    await logAudit({ session: g.session, action: "payment.reject", entity: "payment", entityId: payment.id, ip: clientIp(req) });
    return NextResponse.json({ ok: true });
  }

  const paidCount = await prisma.payment.count({ where: { status: "paid" } });
  const rn = payment.receiptNo || receiptNo(paidCount + 1);

  const ops: any[] = [
    prisma.payment.update({ where: { id: payment.id }, data: { status: "paid", receiptNo: rn, approvedBy: g.session.name, approvedAt: new Date(), remarks } }),
  ];
  if (payment.sessionId) ops.push(prisma.testSession.update({ where: { id: payment.sessionId }, data: { paid: true } }));
  await prisma.$transaction(ops);

  await notifyUser("individual", payment.individualUserId, "payment_approved", "Payment approved — test unlocked", `Receipt ${rn}. You can start your test now.`, "/individual/account");
  await logAudit({ session: g.session, action: "payment.approve", entity: "payment", entityId: payment.id, details: { receiptNo: rn, amount: payment.amount }, ip: clientIp(req) });

  return NextResponse.json({ ok: true, receiptNo: rn });
}
