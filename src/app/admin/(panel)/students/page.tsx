import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StudentsAdminClient, { Row } from "./StudentsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("students")) redirect("/admin");

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      school: { select: { name: true, city: true } },
      sessions: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true, token: true } },
    },
    take: 1000,
  });

  const rows: Row[] = students.map((s) => ({
    id: s.id,
    name: s.name,
    school: s.school.name,
    city: s.school.city || "",
    classCourse: s.classCourse || "",
    mobile: s.mobile || "",
    category: s.category || "",
    status: s.sessions[0]?.status || "none",
    token: s.sessions[0]?.status === "completed" ? s.sessions[0].token : null,
  }));

  return <StudentsAdminClient rows={rows} />;
}
