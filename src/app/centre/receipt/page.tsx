import { requireCentre } from "@/lib/session-helpers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CentreReceipt from "@/components/CentreReceipt";

export const dynamic = "force-dynamic";

export default async function CentreReceiptPage() {
  const session = await requireCentre();
  const centre = await prisma.studyCentre.findUnique({ where: { id: session.sub }, include: { joiningPayment: true } });
  const p = centre?.joiningPayment;
  if (!centre || !p || p.status !== "approved" || !p.receiptNo) notFound();

  return (
    <CentreReceipt
      backHref="/centre"
      data={{
        receiptNo: p.receiptNo,
        centreName: centre.name,
        ownerName: centre.ownerName || "",
        code: centre.code,
        amount: p.amount,
        mode: p.mode,
        reference: p.reference || "",
        date: (p.approvedAt || p.createdAt).toLocaleDateString("en-GB"),
        approvedBy: p.approvedBy || "Administrator",
      }}
    />
  );
}
