import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifyAdmin, notifyUser } from "@/lib/notify";

const TEST_TYPE: Record<string, "student" | "employee"> = { student: "student", employee: "employee", parent: "student" };

// Individual submits a QR/UPI or Cash payment for admin verification (no Razorpay needed).
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "individual")
    return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form." }, { status: 400 });
  const str = (k: string) => String(form.get(k) || "").trim();

  const pkg = str("package");
  const mode = form.get("mode") === "cash" ? "cash" : "qr";
  const pricing = await prisma.pricing.findUnique({ where: { key: pkg } });
  if (!pricing || !pricing.active) return NextResponse.json({ error: "Invalid test selection." }, { status: 400 });
  if (mode === "qr" && !str("reference"))
    return NextResponse.json({ error: "Enter the UPI transaction ID / UTR number." }, { status: 400 });

  let proofPath: string | undefined;
  const proof = form.get("proof") as File | null;
  if (proof && typeof proof === "object" && proof.size > 0) {
    if (proof.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Screenshot must be under 5 MB." }, { status: 400 });
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    const safe = proof.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fname = `iproof_${Date.now()}_${safe}`;
    await writeFile(path.join(dir, fname), Buffer.from(await proof.arrayBuffer()));
    proofPath = fname;
  }

  const user = await prisma.individualUser.findUnique({ where: { id: session.sub } });
  const testType = TEST_TYPE[pkg] || "student";

  const ts = await prisma.testSession.create({
    data: {
      testType, audience: "individual", individualUserId: session.sub,
      takerName: user?.name || session.name, token: randomUUID().replace(/-/g, ""),
      status: "pending", paid: false,
    },
  });
  await prisma.payment.create({
    data: {
      individualUserId: session.sub, sessionId: ts.id, testType: pkg, amount: pricing.amount,
      mode, reference: str("reference") || null, proofPath: proofPath || null,
      remarks: str("remarks") || null, status: "pending",
    },
  });

  await notifyAdmin("payment", `Payment proof submitted (${mode.toUpperCase()})`, `${user?.name || ""} · ₹${pricing.amount} · ${pricing.label}`, "/admin/payment-verification");
  await notifyUser("individual", session.sub, "payment", "Payment under verification", `Your ${mode.toUpperCase()} payment of ₹${pricing.amount} is awaiting admin approval.`, "/individual/account");

  return NextResponse.json({ ok: true });
}
