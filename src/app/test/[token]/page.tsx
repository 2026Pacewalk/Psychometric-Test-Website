import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import TestRunner from "./TestRunner";

export const dynamic = "force-dynamic";

export default async function TestPage({
  params,
}: {
  params: { token: string };
}) {
  const session = await prisma.testSession.findUnique({
    where: { token: params.token },
    include: {
      student: { include: { school: true } },
      employee: { include: { company: true } },
      individualUser: true,
      report: true,
    },
  });

  if (!session) notFound();

  // Individual tests must be paid before they unlock.
  if (session.audience === "individual" && !session.paid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Payment required</h1>
          <p className="mt-2 text-slate-500">This test is locked. Please complete payment to start.</p>
          <Link href="/individual" className="btn-primary mt-6">Go to my account</Link>
        </div>
      </main>
    );
  }

  if (session.status === "completed" && session.report) {
    const takerName = session.student?.name || session.employee?.name || session.takerName || "The candidate";
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="card max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
          <h1 className="text-2xl font-bold text-slate-900">Test already completed</h1>
          <p className="mt-2 text-slate-500">{takerName} has already submitted this assessment.</p>
          <Link href={`/report/${session.token}`} className="btn-primary mt-6">View Report</Link>
        </div>
      </main>
    );
  }

  const questions = await prisma.question.findMany({
    where: { active: true, testType: session.testType },
    orderBy: { order: "asc" },
    select: { id: true, order: true, textEn: true, textPa: true },
  });
  const scaleMax = session.testType === "student" ? 4 : 5;

  const s = session.student;
  const orgName =
    s?.school.name || session.employee?.company.name || "Individual Assessment";

  return (
    <TestRunner
      token={session.token}
      testType={session.testType as "student" | "employee"}
      scaleMax={scaleMax}
      orgName={orgName}
      collectDetails={!!s} // only school students confirm the full details form
      student={{
        name: s?.name || session.takerName || "",
        fatherName: s?.fatherName || "",
        motherName: s?.motherName || "",
        mobile: s?.mobile || "",
        otherMobile: s?.otherMobile || "",
        dob: s?.dob || "",
        classCourse: s?.classCourse || "",
        qualification: s?.qualification || "",
        schoolNameRaw: s?.schoolNameRaw || s?.school.name || "",
        address: s?.address || "",
        category: s?.category || "GEN",
        aim: s?.aim || "",
        venue: s?.venue || "",
      }}
      questions={questions}
      startStep={session.status === "in_progress" || !s ? "test" : "details"}
    />
  );
}
