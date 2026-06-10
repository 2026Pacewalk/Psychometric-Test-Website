import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import PaymentVerifyClient, { PayRow } from "./PaymentVerifyClient";

export const dynamic = "force-dynamic";

export default async function PaymentVerificationPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("payments")) redirect("/admin");

  const payments = await prisma.payment.findMany({
    where: { status: "pending" },
    include: { individualUser: true },
    orderBy: { createdAt: "desc" },
  });
  const rows: PayRow[] = payments.map((p) => ({
    id: p.id,
    user: p.individualUser.name,
    email: p.individualUser.email,
    phone: p.individualUser.phone || "",
    testType: p.testType,
    amount: p.amount,
    mode: p.mode,
    reference: p.reference || "",
    hasProof: !!p.proofPath,
    remarks: p.remarks || "",
    date: p.createdAt.toISOString(),
  }));
  return <PaymentVerifyClient rows={rows} />;
}
