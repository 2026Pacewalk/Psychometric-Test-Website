import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { razorpayConfigured } from "@/lib/razorpay";
import IndividualAccount, { SessionRow, PriceRow } from "./IndividualAccount";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session || session.role !== "individual") redirect("/individual/login");

  const [user, pricing, sessions, settings] = await Promise.all([
    prisma.individualUser.findUnique({ where: { id: session.sub } }),
    prisma.pricing.findMany({ where: { active: true }, orderBy: { amount: "asc" } }),
    prisma.testSession.findMany({
      where: { individualUserId: session.sub },
      include: { report: true, payment: true },
      orderBy: { createdAt: "desc" },
    }),
    getSettings(),
  ]);

  const prices: PriceRow[] = pricing.map((p) => ({ key: p.key, label: p.label, amount: p.amount }));
  const rows: SessionRow[] = sessions.map((s) => ({
    token: s.token,
    testType: s.testType,
    status: s.status,
    paid: s.paid,
    completedAt: s.completedAt ? s.completedAt.toISOString() : null,
    amount: s.payment?.amount ?? null,
    payMode: s.payment?.mode ?? null,
    payStatus: s.payment?.status ?? null,
    receiptNo: s.payment?.receiptNo ?? null,
    paymentId: s.payment?.id ?? null,
  }));

  return (
    <IndividualAccount
      name={session.name}
      prices={prices}
      sessions={rows}
      razorpayActive={razorpayConfigured()}
      pay={{ upiId: settings.upiId, upiName: settings.upiName, hasQr: !!settings.qrImage }}
    />
  );
}
