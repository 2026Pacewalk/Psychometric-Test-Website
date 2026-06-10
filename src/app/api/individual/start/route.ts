import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createRazorpayOrder, razorpayConfigured, publicKeyId } from "@/lib/razorpay";

// Maps the individual's chosen package to an actual test type.
const TEST_TYPE: Record<string, "student" | "employee"> = {
  student: "student",
  employee: "employee",
  parent: "student",
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "individual")
    return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const pkg = String(b.package || "");
  const pricing = await prisma.pricing.findUnique({ where: { key: pkg } });
  if (!pricing || !pricing.active)
    return NextResponse.json({ error: "Invalid test selection." }, { status: 400 });

  if (!razorpayConfigured())
    return NextResponse.json(
      { error: "Online payment is not configured yet. Please add Razorpay keys in .env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)." },
      { status: 503 }
    );

  const testType = TEST_TYPE[pkg] || "student";
  const user = await prisma.individualUser.findUnique({ where: { id: session.sub } });

  const testSession = await prisma.testSession.create({
    data: {
      testType,
      audience: "individual",
      individualUserId: session.sub,
      takerName: user?.name || session.name,
      token: randomUUID().replace(/-/g, ""),
      status: "pending",
      paid: false,
    },
  });

  const order = await createRazorpayOrder(pricing.amount, `ind_${testSession.id}`);
  const payment = await prisma.payment.create({
    data: {
      individualUserId: session.sub,
      sessionId: testSession.id,
      testType: pkg,
      amount: pricing.amount,
      razorpayOrderId: order.id,
      status: "created",
    },
  });

  return NextResponse.json({
    ok: true,
    keyId: publicKeyId(),
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    paymentId: payment.id,
    token: testSession.token,
    name: user?.name,
    email: user?.email,
    contact: user?.phone || "",
    label: pricing.label,
  });
}
