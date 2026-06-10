import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifyAdmin } from "@/lib/notify";

// Centre requests settlement of its pending (online, paid, unsettled) earnings.
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "centre")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pending = await prisma.centreTransaction.findMany({
    where: { centreId: session.sub, paymentMode: "online", paymentStatus: "paid", settlementStatus: "unsettled" },
  });
  const amount = pending.reduce((t, x) => t + x.centreShare, 0);
  if (amount <= 0)
    return NextResponse.json({ error: "No settleable balance available." }, { status: 400 });

  const settlement = await prisma.settlement.create({
    data: { centreId: session.sub, amount, status: "requested" },
  });
  await prisma.centreTransaction.updateMany({
    where: { id: { in: pending.map((p) => p.id) } },
    data: { settlementStatus: "requested", settlementId: settlement.id },
  });

  await notifyAdmin("settlement", "Settlement requested", `${session.name} — ₹${amount}`, "/admin/settlements");
  return NextResponse.json({ ok: true, amount });
}
