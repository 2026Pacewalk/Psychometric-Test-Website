import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { notifyUser } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "individual")
    return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = b;

  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { session: true } });
  if (!payment || payment.individualUserId !== session.sub)
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  const ok = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!ok) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const paidCount = await prisma.payment.count({ where: { status: "paid" } });
  const rn = `AMG/TP/${new Date().getFullYear()}/${String(paidCount + 1).padStart(4, "0")}`;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "paid", razorpayPaymentId: razorpay_payment_id, receiptNo: rn, approvedBy: "Razorpay", approvedAt: new Date() },
    }),
    prisma.testSession.update({ where: { id: payment.sessionId! }, data: { paid: true } }),
  ]);

  await notifyUser("individual", session.sub, "payment_approved", "Payment successful — test unlocked", `Receipt ${rn}.`, "/individual/account");
  return NextResponse.json({ ok: true, token: payment.session?.token });
}
