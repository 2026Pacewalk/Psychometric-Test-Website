import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CentreReceipt from "@/components/CentreReceipt";

export const dynamic = "force-dynamic";

export default async function IndividualReceiptPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "individual") redirect("/individual/login");

  const p = await prisma.payment.findUnique({ where: { id: params.id }, include: { individualUser: true } });
  if (!p || p.individualUserId !== session.sub || p.status !== "paid" || !p.receiptNo) notFound();

  return (
    <CentreReceipt
      heading="PAYMENT RECEIPT"
      nameLabel="Name"
      codeLabel="Test"
      backHref="/individual/account"
      data={{
        receiptNo: p.receiptNo,
        centreName: p.individualUser.name,
        ownerName: p.individualUser.email,
        code: p.testType,
        amount: p.amount,
        mode: p.mode,
        reference: p.reference || p.razorpayPaymentId || "",
        date: (p.approvedAt || p.createdAt).toLocaleDateString("en-GB"),
        approvedBy: p.approvedBy || "Administrator",
      }}
    />
  );
}
