import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

// Logged-in centre submits its joining-fee payment (cash or UPI) for verification.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "centre")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form." }, { status: 400 });

  const str = (k: string) => String(form.get(k) || "").trim();
  const mode = form.get("mode") === "upi" ? "upi" : "cash";

  if (mode === "upi" && !str("reference"))
    return NextResponse.json({ error: "Enter the UPI transaction ID / UTR number." }, { status: 400 });

  let proofPath: string | undefined;
  const proof = form.get("proof") as File | null;
  if (proof && typeof proof === "object" && proof.size > 0) {
    if (proof.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Screenshot must be under 5 MB." }, { status: 400 });
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    const safe = proof.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fname = `proof_${Date.now()}_${safe}`;
    await writeFile(path.join(dir, fname), Buffer.from(await proof.arrayBuffer()));
    proofPath = fname;
  }

  const { joiningFee } = await getSettings();
  const data = {
    amount: joiningFee,
    mode,
    collectedBy: mode === "cash" ? str("collectedBy") || null : null,
    reference: str("reference") || null,
    paymentDate: str("paymentDate") || null,
    status: "pending",
    ...(proofPath ? { proofPath } : {}),
  };

  await prisma.joiningFeePayment.upsert({
    where: { centreId: session.sub },
    update: data,
    create: { centreId: session.sub, ...data },
  });
  await prisma.studyCentre.update({ where: { id: session.sub }, data: { status: "payment_verification" } });

  return NextResponse.json({ ok: true });
}
