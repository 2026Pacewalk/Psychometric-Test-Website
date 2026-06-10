import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import PricingClient, { PriceRow } from "./PricingClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("pricing")) redirect("/admin");

  const pricing = await prisma.pricing.findMany({ orderBy: { amount: "asc" } });
  const rows: PriceRow[] = pricing.map((p) => ({ key: p.key, label: p.label, amount: p.amount, active: p.active }));
  return <PricingClient rows={rows} />;
}
