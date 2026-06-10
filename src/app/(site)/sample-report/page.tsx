import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { computeReport, QuestionInput, AnswerInput } from "@/lib/scoring";
import ReportView from "@/components/report/ReportView";

export const metadata: Metadata = {
  title: "Sample Report",
  description:
    "View a full sample psychometric report — 12 core life skills, category analysis, RIASEC career suggestions and a final counsellor recommendation.",
};

export const dynamic = "force-dynamic";

export default async function SampleReportPage() {
  const questions = await prisma.question.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, order: true, skill: true, reverse: true },
  });

  // Deterministic synthetic answers so the sample is consistent and varied.
  const answers: AnswerInput[] = questions.map((q) => ({
    questionId: q.id,
    value: ((q.order * 3) % 5) + 1,
  }));
  const qInputs: QuestionInput[] = questions.map((q) => ({
    id: q.id,
    order: q.order,
    skill: q.skill,
    reverse: q.reverse,
  }));

  const data = computeReport(qInputs, answers, new Date().toISOString());

  return (
    <>
      <div className="border-b border-slate-200 bg-brand-50">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-6">
          <div>
            <p className="section-eyebrow">Sample</p>
            <h1 className="text-2xl font-extrabold text-slate-900">Example Student Report</h1>
            <p className="text-sm text-slate-500">
              This is a live, automatically generated sample. Real reports use each student&apos;s own answers.
            </p>
          </div>
          <Link href="/how-to-enroll" className="btn-primary text-sm">Enroll to generate real reports</Link>
        </div>
      </div>

      <ReportView
        data={data}
        completedAt={data.generatedAt}
        student={{
          name: "Sample Student",
          fatherName: "—",
          motherName: "—",
          mobile: "—",
          otherMobile: "—",
          dob: "01/01/2008",
          classCourse: "10th",
          qualification: "Secondary",
          schoolName: "Demonstration School",
          address: "Punjab, India",
          category: "GEN",
          aim: "Engineer",
          venue: "School Campus",
        }}
      />
    </>
  );
}
