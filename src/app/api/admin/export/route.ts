import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { ReportData } from "@/lib/scoring";
import { MIReportData } from "@/lib/mi";

export async function GET(req: NextRequest) {
  const g = await guardAdmin("results");
  if ("error" in g) return g.error;

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim().toLowerCase() || "";

  const sessions = await prisma.testSession.findMany({
    where: { status: "completed" },
    include: {
      student: { include: { school: true } },
      employee: { include: { company: true } },
      individualUser: true,
      report: true,
    },
    orderBy: { completedAt: "desc" },
  });

  const rows = sessions
    .map((s) => {
      const org = s.student?.school.name || s.employee?.company.name || "Individual";
      const name = s.student?.name || s.employee?.name || s.takerName || "Candidate";
      const city = s.student?.school.city || s.employee?.company.city || s.individualUser?.city || "";
      let headline = "";
      if (s.report!.kind === "student_mi") {
        const d = JSON.parse(s.report!.data) as MIReportData;
        headline = `${d.topIntelligences[0] || ""}`;
      } else {
        const d = JSON.parse(s.report!.data) as ReportData;
        headline = `${d.overallPercent}% · ${d.topRiasec[0] || ""}`;
      }
      return {
        Organisation: org,
        City: city,
        Name: name,
        TestType: s.testType,
        Audience: s.audience,
        Date: s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "",
        Result: headline,
        _search: [org, name, city].join(" ").toLowerCase(),
      };
    })
    .filter((r) => (!q ? true : r._search.includes(q)))
    .map(({ _search, ...rest }) => rest);

  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: "No records" }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "All Reports");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="all-reports-${Date.now()}.xlsx"`,
    },
  });
}
