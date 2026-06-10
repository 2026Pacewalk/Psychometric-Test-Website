import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SchoolsClient, { SchoolRow } from "./SchoolsClient";

export const dynamic = "force-dynamic";

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("schools")) redirect("/admin");

  const schools = await prisma.school.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { students: true } } },
  });

  const rows: SchoolRow[] = schools.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    email: s.email,
    phone: s.phone || "",
    city: s.city || "",
    state: s.state || "",
    address: s.address || "",
    principal: s.principal || "",
    status: s.status,
    students: s._count.students,
  }));

  return <SchoolsClient rows={rows} initialStatus={searchParams.status || ""} />;
}
