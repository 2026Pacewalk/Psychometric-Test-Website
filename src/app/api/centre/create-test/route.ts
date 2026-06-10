import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { computeSplit } from "@/lib/centre";
import { createRazorpayOrder, razorpayConfigured, publicKeyId } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "centre")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const takerName = String(b.takerName || "").trim();
  const testType = b.testType === "employee" ? "employee" : "student";
  const fee = Math.max(0, Math.round(Number(b.fee) || 0));
  const paymentMode = ["online", "offline", "manual"].includes(b.paymentMode) ? b.paymentMode : "offline";

  if (!takerName) return NextResponse.json({ error: "User / student name is required." }, { status: 400 });
  if (fee <= 0) return NextResponse.json({ error: "Enter a valid fee amount." }, { status: 400 });

  const centre = await prisma.studyCentre.findUnique({ where: { id: session.sub } });
  if (!centre) return NextResponse.json({ error: "Centre not found." }, { status: 404 });

  const { amgShare, centreShare } = computeSplit(fee, centre.commissionPercent);
  const online = paymentMode === "online";

  if (online && !razorpayConfigured())
    return NextResponse.json({ error: "Online payment is not configured. Add Razorpay keys, or use offline/manual." }, { status: 503 });

  const testSession = await prisma.testSession.create({
    data: {
      testType, audience: "centre", studyCentreId: centre.id, takerName,
      token: randomUUID().replace(/-/g, ""), status: "pending", paid: !online,
    },
  });

  const txn = await prisma.centreTransaction.create({
    data: {
      centreId: centre.id, sessionId: testSession.id, takerName, testType, totalFee: fee,
      paymentMode, amgShare, centreShare,
      paymentStatus: online ? "pending" : "paid", settlementStatus: "unsettled",
    },
  });

  if (online) {
    const order = await createRazorpayOrder(fee, `centre_${txn.id}`);
    await prisma.centreTransaction.update({ where: { id: txn.id }, data: { razorpayOrderId: order.id } });
    return NextResponse.json({
      ok: true, online: true, keyId: publicKeyId(), orderId: order.id, amount: order.amount,
      currency: order.currency, txnId: txn.id, token: testSession.token, name: takerName,
    });
  }

  return NextResponse.json({ ok: true, online: false, token: testSession.token });
}
