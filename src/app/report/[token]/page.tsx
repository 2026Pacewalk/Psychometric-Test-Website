import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportData } from "@/lib/scoring";
import { MIReportData } from "@/lib/mi";
import { getSession } from "@/lib/auth";
import { ReportLang, normalizeLang } from "@/lib/i18n";
import ReportView from "@/components/report/ReportView";
import MIReportView from "@/components/report/MIReportView";

export const dynamic = "force-dynamic";

export type ProfileRow = [string, string | null | undefined];

async function resolveLang(searchParams: { lang?: string }): Promise<ReportLang> {
  if (searchParams.lang) return normalizeLang(searchParams.lang);
  const s = await getSession();
  if (s) {
    try {
      if (s.role === "school") return normalizeLang((await prisma.school.findUnique({ where: { id: s.sub } }))?.reportLang);
      if (s.role === "company") return normalizeLang((await prisma.company.findUnique({ where: { id: s.sub } }))?.reportLang);
      if (s.role === "centre") return normalizeLang((await prisma.studyCentre.findUnique({ where: { id: s.sub } }))?.reportLang);
      if (s.role === "individual") return normalizeLang((await prisma.individualUser.findUnique({ where: { id: s.sub } }))?.reportLang);
    } catch {
      /* ignore */
    }
  }
  return "both";
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { lang?: string };
}) {
  const lang = await resolveLang(searchParams);
  const session = await prisma.testSession.findUnique({
    where: { token: params.token },
    include: {
      student: { include: { school: true } },
      employee: { include: { company: true } },
      individualUser: true,
      studyCentre: true,
      report: true,
    },
  });

  if (!session || !session.report) notFound();

  const completedAt = session.completedAt?.toISOString() || new Date(0).toISOString();
  const date = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const testTypeLabel = session.testType === "student" ? "Multiple Intelligence (Class 9–10)" : "Employee / Self Assessment";

  // ---- Build name + profile block dynamically by audience (never hardcoded) ----
  const s = session.student;
  const e = session.employee;
  const iu = session.individualUser;
  const sc = session.studyCentre;
  let name = session.takerName || "Candidate";
  let profile: ProfileRow[] = [];

  if (session.audience === "company" && e) {
    name = e.name;
    profile = [
      ["Company Name", e.company.name],
      ["Designation", e.designation],
      ["Department", e.department],
      ["Employee ID", e.id.slice(-6).toUpperCase()],
      ["Mobile", e.mobile],
      ["Email", e.email],
      ["Date of Birth", e.dob],
      ["Work Location", e.address || e.company.city],
      ["Assessment Type", testTypeLabel],
      ["Report Date", date],
    ];
  } else if (session.audience === "individual") {
    name = iu?.name || session.takerName || "Candidate";
    profile = [
      ["Mobile", iu?.phone],
      ["Email", iu?.email],
      ["City", iu?.city],
      ["Date of Birth", iu?.dob],
      ["Assessment Type", testTypeLabel],
      ["Report Date", date],
    ];
  } else if (session.audience === "centre") {
    name = session.takerName || "Candidate";
    profile = [
      ["Study Centre Name", sc?.name],
      ["Candidate Name", name],
      ["Assessment Type", testTypeLabel],
      ["Mobile", sc?.mobile],
      ["City", sc?.city],
      ["Report Date", date],
    ];
  } else if (s) {
    // School student
    name = s.name;
    profile = [
      ["School Name", s.schoolNameRaw || s.school.name],
      ["Class / Course", s.classCourse],
      ["Father Name", s.fatherName],
      ["Mother Name", s.motherName],
      ["Mobile", s.mobile],
      ["Date of Birth", s.dob],
      ["Category", s.category],
      ["Aim / Goal", s.aim],
      ["Address", s.address],
      ["Venue", s.venue],
      ["Report Date", date],
    ];
  } else {
    profile = [["Assessment Type", testTypeLabel], ["Report Date", date]];
  }

  if (session.report.kind === "student_mi") {
    const data = JSON.parse(session.report.data) as MIReportData;
    return <MIReportView data={data} lang={lang} completedAt={completedAt} name={name} profile={profile} />;
  }

  const data = JSON.parse(session.report.data) as ReportData;
  return <ReportView data={data} lang={lang} completedAt={completedAt} name={name} profile={profile} />;
}
