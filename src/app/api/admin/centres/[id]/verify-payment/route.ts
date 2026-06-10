import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { notifyUser } from "@/lib/notify";

function receiptNo(seq: number) {
  const year = new Date().getFullYear();
  return `AMG/JF/${year}/${String(seq).padStart(4, "0")}`;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const action = b.action === "reject" ? "reject" : b.action === "approve" ? "approve" : null;
  if (!action) return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  const centre = await prisma.studyCentre.findUnique({ where: { id: params.id }, include: { joiningPayment: true } });
  if (!centre || !centre.joiningPayment)
    return NextResponse.json({ error: "No joining-fee payment found." }, { status: 404 });

  const remarks = typeof b.remarks === "string" ? b.remarks.trim() : undefined;

  if (action === "reject") {
    await prisma.$transaction([
      prisma.joiningFeePayment.update({ where: { centreId: centre.id }, data: { status: "rejected", remarks, approvedBy: g.session.name, approvedAt: new Date() } }),
      prisma.studyCentre.update({ where: { id: centre.id }, data: { status: "rejected" } }),
    ]);
    await notifyUser("centre", centre.id, "payment_rejected", "Joining fee payment rejected", remarks || "Please contact the administrator.", "/centre/billing");
    return NextResponse.json({ ok: true });
  }

  // approve: must have a login password (existing or provided now)
  const password = typeof b.password === "string" ? b.password.trim() : "";
  if (!centre.passwordHash && !password)
    return NextResponse.json({ error: "Set a login password to activate this centre." }, { status: 400 });

  const approvedCount = await prisma.joiningFeePayment.count({ where: { status: "approved" } });
  const rn = centre.joiningPayment.receiptNo || receiptNo(approvedCount + 1);

  const centreData: Record<string, unknown> = { status: "active" };
  if (password) centreData.passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.joiningFeePayment.update({
      where: { centreId: centre.id },
      data: { status: "approved", receiptNo: rn, approvedBy: g.session.name, approvedAt: new Date(), remarks },
    }),
    prisma.studyCentre.update({ where: { id: centre.id }, data: centreData }),
  ]);

  await notifyUser("centre", centre.id, "payment_verified", "Joining fee approved — account active", `Receipt ${rn}`, "/centre/receipt");
  return NextResponse.json({ ok: true, receiptNo: rn });
}
