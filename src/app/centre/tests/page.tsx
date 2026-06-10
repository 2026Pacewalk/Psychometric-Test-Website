import { requireActiveCentre as requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import CentreTestsClient, { SessionRow, PriceRow } from "./CentreTestsClient";

export const dynamic = "force-dynamic";

export default async function CentreTestsPage() {
  const session = await requireCentre();
  const [pricing, sessions] = await Promise.all([
    prisma.pricing.findMany({ where: { active: true } }),
    prisma.testSession.findMany({
      where: { studyCentreId: session.sub },
      include: { report: true, transaction: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const studentPrice = pricing.find((p) => p.key === "student")?.amount ?? 499;
  const employeePrice = pricing.find((p) => p.key === "employee")?.amount ?? 799;
  const prices: PriceRow = { student: studentPrice, employee: employeePrice };

  const rows: SessionRow[] = sessions.map((s) => ({
    token: s.token,
    takerName: s.takerName || "—",
    testType: s.testType,
    status: s.status,
    paid: s.paid,
    fee: s.transaction?.totalFee ?? null,
    mode: s.transaction?.paymentMode ?? null,
    paymentStatus: s.transaction?.paymentStatus ?? null,
  }));

  return <CentreTestsClient prices={prices} sessions={rows} />;
}
