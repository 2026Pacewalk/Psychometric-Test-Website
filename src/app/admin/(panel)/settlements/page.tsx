import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SettlementsClient, { SettlementRow } from "./SettlementsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettlementsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("centres")) redirect("/admin");

  const settlements = await prisma.settlement.findMany({
    orderBy: { createdAt: "desc" },
    include: { centre: { select: { name: true, code: true } } },
  });

  const rows: SettlementRow[] = settlements.map((s) => ({
    id: s.id, centre: s.centre.name, code: s.centre.code, amount: s.amount, status: s.status,
    reference: s.reference || "", note: s.note || "",
    createdAt: s.createdAt.toISOString(),
    processedAt: s.processedAt ? s.processedAt.toISOString() : null,
  }));

  return <SettlementsClient rows={rows} />;
}
