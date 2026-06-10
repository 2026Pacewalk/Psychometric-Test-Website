import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

const STATUSES = ["requested", "approved", "rejected", "paid"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const b = await req.json().catch(() => ({}));
  const status = STATUSES.includes(b.status) ? b.status : undefined;
  if (!status) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const settlement = await prisma.settlement.findUnique({ where: { id: params.id } });
  if (!settlement) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const data: Record<string, unknown> = { status };
  if (typeof b.reference === "string") data.reference = b.reference.trim();
  if (typeof b.note === "string") data.note = b.note.trim();
  if (typeof b.proofPath === "string") data.proofPath = b.proofPath.trim();
  if (status === "paid" || status === "rejected") data.processedAt = new Date();

  const ops: any[] = [prisma.settlement.update({ where: { id: params.id }, data })];

  if (status === "paid") {
    ops.push(prisma.centreTransaction.updateMany({
      where: { settlementId: params.id }, data: { settlementStatus: "settled" },
    }));
  } else if (status === "rejected") {
    // release the transactions so the centre can request again
    ops.push(prisma.centreTransaction.updateMany({
      where: { settlementId: params.id }, data: { settlementStatus: "unsettled", settlementId: null },
    }));
  }
  await prisma.$transaction(ops);
  return NextResponse.json({ ok: true });
}
