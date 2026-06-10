import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import CareersClient, { CRow } from "./CareersClient";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("careers")) redirect("/admin");

  const careers = await prisma.careerSuggestion.findMany({ orderBy: { type: "asc" } });
  const rows: CRow[] = careers.map((c) => ({
    type: c.type,
    label: c.label,
    fields: c.fields,
    traits: c.traits,
    formula: c.formula,
  }));
  return <CareersClient rows={rows} />;
}
