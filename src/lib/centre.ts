// Authorised Study Centre helpers: commission split + wallet summary.

export function computeSplit(totalFee: number, commissionPercent: number) {
  const pct = Math.max(0, Math.min(100, commissionPercent));
  const amgShare = Math.round((totalFee * pct) / 100);
  const centreShare = totalFee - amgShare;
  return { amgShare, centreShare };
}

export interface Txn {
  totalFee: number;
  amgShare: number;
  centreShare: number;
  paymentMode: string;
  paymentStatus: string;
  settlementStatus: string;
}

export interface WalletSummary {
  totalCollected: number;
  amgShare: number;
  centreShare: number;
  onlineTotal: number;
  offlineTotal: number;
  pendingSettlement: number; // centre share not yet settled (online, paid)
  settled: number;
  refunded: number;
  failedCount: number;
  amgDueFromCentre: number; // offline AMG share the centre owes AMG
}

export function walletSummary(txns: Txn[]): WalletSummary {
  const s: WalletSummary = {
    totalCollected: 0, amgShare: 0, centreShare: 0, onlineTotal: 0, offlineTotal: 0,
    pendingSettlement: 0, settled: 0, refunded: 0, failedCount: 0, amgDueFromCentre: 0,
  };
  for (const t of txns) {
    if (t.paymentStatus === "failed") { s.failedCount += 1; continue; }
    if (t.paymentStatus === "refunded") { s.refunded += t.totalFee; continue; }
    if (t.paymentStatus !== "paid") continue;

    s.totalCollected += t.totalFee;
    s.amgShare += t.amgShare;
    s.centreShare += t.centreShare;
    if (t.paymentMode === "online") s.onlineTotal += t.totalFee;
    else s.offlineTotal += t.totalFee;

    // Online: AMG holds the money, centre share is payable to centre via settlement.
    if (t.paymentMode === "online") {
      if (t.settlementStatus === "settled") s.settled += t.centreShare;
      else s.pendingSettlement += t.centreShare;
    } else {
      // Offline/manual: centre already holds the cash, owes AMG its share.
      if (t.settlementStatus !== "settled") s.amgDueFromCentre += t.amgShare;
    }
  }
  return s;
}

export const CENTRE_STATUSES = [
  "submitted",
  "payment_pending",
  "payment_verification",
  "approved",
  "active",
  "inactive",
  "rejected",
  "suspended",
];

// Statuses that allow the centre to log in / be active.
export const CENTRE_LOGIN_STATUSES = ["approved", "active"];

export const CENTRE_STATUS_LABEL: Record<string, string> = {
  submitted: "Application Submitted",
  payment_pending: "Payment Pending",
  payment_verification: "Payment Under Verification",
  approved: "Approved",
  active: "Active",
  inactive: "Inactive",
  rejected: "Rejected",
  suspended: "Suspended",
};

export const PAYMENT_MODES = ["online", "offline", "manual"];
export const JOINING_MODES = ["cash", "upi"];
