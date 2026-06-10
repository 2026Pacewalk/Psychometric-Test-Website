import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function GET() {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const payments = await prisma.joiningFeePayment.findMany({
    include: { centre: { select: { name: true, code: true, ownerName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = payments.map((p) => ({
    "Receipt No": p.receiptNo || "",
    Date: new Date(p.createdAt).toLocaleDateString("en-GB"),
    Centre: p.centre.name,
    Code: p.centre.code,
    Owner: p.centre.ownerName || "",
    Amount: p.amount,
    Mode: p.mode,
    Reference: p.reference || "",
    "Payment Date": p.paymentDate || "",
    Status: p.status,
    "Approved By": p.approvedBy || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: "No records" }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Joining Fee Payments");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="joining-fee-payments-${Date.now()}.xlsx"`,
    },
  });
}
