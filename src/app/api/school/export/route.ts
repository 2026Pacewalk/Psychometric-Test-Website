import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { MIReportData, INTELLIGENCES } from "@/lib/mi";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "school")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const cls = sp.get("class")?.trim().toLowerCase() || "";
  const category = sp.get("category")?.trim() || "";
  const q = sp.get("q")?.trim().toLowerCase() || "";
  const from = sp.get("from") ? new Date(sp.get("from")!) : null;
  const to = sp.get("to") ? new Date(sp.get("to") + "T23:59:59") : null;

  const sessions = await prisma.testSession.findMany({
    where: { status: "completed", student: { schoolId: session.sub } },
    include: { student: true, report: true },
    orderBy: { completedAt: "desc" },
  });

  const rows = sessions
    .filter((s) => {
      if (!s.student) return false;
      if (cls && !(s.student.classCourse || "").toLowerCase().includes(cls)) return false;
      if (category && s.student.category !== category) return false;
      if (q && !s.student.name.toLowerCase().includes(q)) return false;
      if (from && s.completedAt && s.completedAt < from) return false;
      if (to && s.completedAt && s.completedAt > to) return false;
      return true;
    })
    .map((s) => {
      const data = JSON.parse(s.report!.data) as MIReportData;
      const row: Record<string, string | number> = {
        Name: s.student!.name,
        Father: s.student!.fatherName || "",
        Mobile: s.student!.mobile || "",
        Class: s.student!.classCourse || "",
        Category: s.student!.category || "",
        DOB: s.student!.dob || "",
        Aim: s.student!.aim || "",
        Date: s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "",
        "Top Intelligence": data.topIntelligences[0] || "",
      };
      for (const it of INTELLIGENCES) {
        const r = data.intelligences.find((x) => x.key === it.key);
        row[it.short] = r ? r.percent : 0;
      }
      return row;
    });

  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: "No records" }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reports");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="reports-${Date.now()}.xlsx"`,
    },
  });
}
