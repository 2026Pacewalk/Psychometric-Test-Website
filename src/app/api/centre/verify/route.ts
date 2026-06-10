import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "centre")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, txnId } = b;

  const txn = await prisma.centreTransaction.findUnique({ where: { id: txnId }, include: { session: true } });
  if (!txn || txn.centreId !== session.sub)
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });

  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    await prisma.centreTransaction.update({ where: { id: txn.id }, data: { paymentStatus: "failed" } });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.centreTransaction.update({
      where: { id: txn.id },
      data: { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
    }),
    prisma.testSession.update({ where: { id: txn.sessionId! }, data: { paid: true } }),
  ]);

  return NextResponse.json({ ok: true, token: txn.session?.token });
}
