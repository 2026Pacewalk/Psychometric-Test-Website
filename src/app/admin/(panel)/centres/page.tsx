import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { walletSummary } from "@/lib/centre";
import StatCard from "@/components/dashboard/StatCard";
import CentresClient, { CentreRow } from "./CentresClient";

export const dynamic = "force-dynamic";

export default async function AdminCentresPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("centres")) redirect("/admin");

  const centres = await prisma.studyCentre.findMany({
    orderBy: { createdAt: "desc" },
    include: { transactions: true, joiningPayment: true },
  });

  let totalCentres = centres.length;
  let active = 0, amgShare = 0, centreShare = 0, collected = 0, amgDue = 0;

  const rows: CentreRow[] = centres.map((c) => {
    if (["approved", "active"].includes(c.status)) active += 1;
    const w = walletSummary(c.transactions);
    collected += w.totalCollected; amgShare += w.amgShare; centreShare += w.centreShare; amgDue += w.amgDueFromCentre;
    return {
      id: c.id, name: c.name, code: c.code, email: c.email, ownerName: c.ownerName || "",
      mobile: c.mobile || "", city: c.city || "", district: c.district || "", state: c.state || "",
      address: c.address || "", existingInstitute: c.existingInstitute || "", registrationType: c.registrationType || "",
      expectedStudents: c.expectedStudents ?? null, message: c.message || "", hasDoc: !!c.documentPath,
      commissionPercent: c.commissionPercent, status: c.status, hasLogin: !!c.passwordHash,
      collected: w.totalCollected, amgShare: w.amgShare, centreShare: w.centreShare,
      amgDue: w.amgDueFromCentre, pending: w.pendingSettlement,
      jp: c.joiningPayment
        ? {
            amount: c.joiningPayment.amount, mode: c.joiningPayment.mode,
            status: c.joiningPayment.status, reference: c.joiningPayment.reference || "",
            paymentDate: c.joiningPayment.paymentDate || "", hasProof: !!c.joiningPayment.proofPath,
            receiptNo: c.joiningPayment.receiptNo || "", remarks: c.joiningPayment.remarks || "",
          }
        : null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Centres" value={totalCentres} icon="centre" tone="brand" />
        <StatCard label="Active Centres" value={active} icon="check" tone="green" />
        <StatCard label="Centre Collections" value={`₹${collected}`} icon="cash" tone="brand" />
        <StatCard label="AMG Share" value={`₹${amgShare}`} icon="bank" tone="violet" />
        <StatCard label="Offline Due to AMG" value={`₹${amgDue}`} icon="pin" tone="amber" />
      </div>
      <CentresClient rows={rows} />
    </div>
  );
}
