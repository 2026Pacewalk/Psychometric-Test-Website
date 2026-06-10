import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportData } from "@/lib/scoring";
import { MIReportData } from "@/lib/mi";
import { getSession } from "@/lib/auth";
import { ReportLang, normalizeLang } from "@/lib/i18n";
import ReportView from "@/components/report/ReportView";
import MIReportView from "@/components/report/MIReportView";

export const dynamic = "force-dynamic";

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
      report: true,
    },
  });

  if (!session || !session.report) notFound();

  const completedAt = session.completedAt?.toISOString() || new Date(0).toISOString();

  // Student MI report
  if (session.report.kind === "student_mi") {
    const data = JSON.parse(session.report.data) as MIReportData;
    const s = session.student;
    return (
      <MIReportView
        data={data}
        lang={lang}
        completedAt={completedAt}
        taker={{
          name: s?.name || session.takerName || "Student",
          dob: s?.dob,
          email: s?.email || session.individualUser?.email,
          mobile: s?.mobile,
          address: s?.address,
          city: session.individualUser?.city || null,
          classCourse: s?.classCourse,
          schoolName: s?.schoolNameRaw || s?.school.name,
        }}
      />
    );
  }

  // Employee / skills report
  const data = JSON.parse(session.report.data) as ReportData;
  const s = session.student;
  const e = session.employee;
  return (
    <ReportView
      data={data}
      lang={lang}
      completedAt={completedAt}
      student={{
        name: s?.name || e?.name || session.takerName || "Candidate",
        fatherName: s?.fatherName || null,
        motherName: s?.motherName || null,
        mobile: s?.mobile || e?.mobile || null,
        otherMobile: s?.otherMobile || null,
        dob: s?.dob || e?.dob || null,
        classCourse: s?.classCourse || e?.designation || null,
        qualification: s?.qualification || e?.department || null,
        schoolName: s?.schoolNameRaw || s?.school.name || e?.company.name || null,
        address: s?.address || e?.address || null,
        category: s?.category || null,
        aim: s?.aim || null,
        venue: s?.venue || null,
      }}
    />
  );
}
