import { requireSchool } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import { MIReportData } from "@/lib/mi";
import ReportsClient, { ReportRow } from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await requireSchool();
  const sessions = await prisma.testSession.findMany({
    where: { status: "completed", student: { schoolId: session.sub } },
    include: { student: true, report: true },
    orderBy: { completedAt: "desc" },
  });

  const rows: ReportRow[] = sessions.map((s) => {
    const data = JSON.parse(s.report!.data) as MIReportData;
    const best = [...data.intelligences].sort((a, b) => b.percent - a.percent)[0];
    return {
      token: s.token,
      name: s.student!.name,
      classCourse: s.student!.classCourse || "",
      category: s.student!.category || "",
      mobile: s.student!.mobile || "",
      date: s.completedAt ? s.completedAt.toISOString() : "",
      overall: best ? best.percent : 0,
      top: data.topIntelligences[0] || "",
    };
  });

  return <ReportsClient rows={rows} />;
}
