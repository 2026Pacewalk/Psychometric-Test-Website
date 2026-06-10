import { requireSchool } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import StudentsClient, { StudentRow } from "./StudentsClient";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const session = await requireSchool();
  const students = await prisma.student.findMany({
    where: { schoolId: session.sub },
    orderBy: { createdAt: "desc" },
    include: {
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { report: { select: { totalScore: true } } },
      },
    },
  });

  const rows: StudentRow[] = students.map((s) => {
    const latest = s.sessions[0];
    return {
      id: s.id,
      name: s.name,
      classCourse: s.classCourse,
      mobile: s.mobile,
      category: s.category,
      status: latest?.status ?? "none",
      token: latest?.token ?? null,
      score: latest?.report?.totalScore ?? null,
    };
  });

  return <StudentsClient initial={rows} />;
}
