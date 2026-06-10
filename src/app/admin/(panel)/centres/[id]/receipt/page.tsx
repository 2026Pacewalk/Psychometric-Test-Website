import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CentreReceipt from "@/components/CentreReceipt";

export const dynamic = "force-dynamic";

export default async function AdminReceiptPage({ params }: { params: { id: string } }) {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("centres")) redirect("/admin");

  const centre = await prisma.studyCentre.findUnique({ where: { id: params.id }, include: { joiningPayment: true } });
  const p = centre?.joiningPayment;
  if (!centre || !p || p.status !== "approved" || !p.receiptNo) notFound();

  return (
    <CentreReceipt
      backHref="/admin/centres"
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
