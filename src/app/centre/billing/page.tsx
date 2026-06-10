import { requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import BillingClient from "./BillingClient";

export const dynamic = "force-dynamic";

export default async function CentreBillingPage() {
  const session = await requireCentre();
  const [centre, settings] = await Promise.all([
    prisma.studyCentre.findUnique({ where: { id: session.sub }, include: { joiningPayment: true } }),
    getSettings(),
  ]);
  if (!centre) return null;

  const p = centre.joiningPayment;
  return (
    <BillingClient
      status={centre.status}
      commissionPercent={centre.commissionPercent}
      settings={{ joiningFee: settings.joiningFee, upiId: settings.upiId, upiName: settings.upiName, hasQr: !!settings.qrImage }}
      payment={p ? {
        amount: p.amount, mode: p.mode, status: p.status, reference: p.reference || "",
        paymentDate: p.paymentDate || "", hasProof: !!p.proofPath, receiptNo: p.receiptNo || "", remarks: p.remarks || "",
      } : null}
    />
  );
}
