import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const centreId = req.nextUrl.searchParams.get("centreId") || undefined;
  const txns = await prisma.centreTransaction.findMany({
    where: centreId ? { centreId } : {},
    include: { centre: { select: { name: true, code: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = txns.map((t) => ({
    "Transaction ID": t.id,
    Date: new Date(t.createdAt).toLocaleDateString("en-GB"),
    User: t.takerName,
    "Test Type": t.testType,
    "Study Centre": t.centre.name,
    "Centre Code": t.centre.code,
    "Total Fee": t.totalFee,
    "Payment Mode": t.paymentMode,
    "AMG Share": t.amgShare,
    "Centre Share": t.centreShare,
    "Payment Status": t.paymentStatus,
    "Settlement Status": t.settlementStatus,
    "Razorpay Payment ID": t.razorpayPaymentId || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: "No records" }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Centre Transactions");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="centre-transactions-${Date.now()}.xlsx"`,
    },
  });
}
