import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import IndividualsClient, { IndRow } from "./IndividualsClient";

export const dynamic = "force-dynamic";

export default async function IndividualsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("individuals")) redirect("/admin");

  const users = await prisma.individualUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sessions: true, payments: true } } },
  });

  const rows: IndRow[] = users.map((u) => ({
    id: u.id, name: u.name, email: u.email, phone: u.phone || "", city: u.city || "",
    tests: u._count.sessions, payments: u._count.payments,
    joined: u.createdAt.toISOString(),
  }));
  return <IndividualsClient rows={rows} />;
}
