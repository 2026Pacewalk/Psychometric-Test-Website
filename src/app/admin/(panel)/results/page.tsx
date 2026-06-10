import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportData } from "@/lib/scoring";
import { MIReportData } from "@/lib/mi";
import ResultsClient, { Row } from "./ResultsClient";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("results")) redirect("/admin");

  const sessions = await prisma.testSession.findMany({
    where: { status: "completed" },
    include: {
      student: { include: { school: true } },
      employee: { include: { company: true } },
      individualUser: true,
      report: true,
    },
    orderBy: { completedAt: "desc" },
    take: 1000,
  });

  const rows: Row[] = sessions.map((s) => {
    let overall = 0;
    let top = "";
    if (s.report!.kind === "student_mi") {
      const d = JSON.parse(s.report!.data) as MIReportData;
      const best = [...d.intelligences].sort((a, b) => b.percent - a.percent)[0];
      overall = best ? best.percent : 0;
      top = d.topIntelligences[0] || "";
    } else {
      const d = JSON.parse(s.report!.data) as ReportData;
      overall = d.overallPercent;
      top = d.topRiasec[0] || "";
    }
    const st = s.student;
    const em = s.employee;
    return {
      token: s.token,
      name: st?.name || em?.name || s.takerName || "Candidate",
      school: st?.school.name || em?.company.name || "Individual",
      city: st?.school.city || em?.company.city || s.individualUser?.city || "",
      classCourse: st?.classCourse || em?.designation || s.testType,
      date: s.completedAt ? s.completedAt.toISOString() : "",
      overall,
      top,
    };
  });

  return <ResultsClient rows={rows} />;
}
