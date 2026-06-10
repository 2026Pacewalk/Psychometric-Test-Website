import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeReport, QuestionInput, AnswerInput } from "@/lib/scoring";
import { computeMIReport, MIQuestionInput } from "@/lib/mi";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await prisma.testSession.findUnique({ where: { token: params.token } });
  if (!session) return NextResponse.json({ error: "Invalid test link." }, { status: 404 });
  if (session.status === "completed")
    return NextResponse.json({ error: "Test already completed." }, { status: 409 });
  if (session.audience === "individual" && !session.paid)
    return NextResponse.json({ error: "Payment required before submitting." }, { status: 402 });

  const body = await req.json().catch(() => ({}));
  const language = body.language === "pa" ? "pa" : "en";
  const rawAnswers: { questionId: string; value: number }[] = Array.isArray(body.answers) ? body.answers : [];

  const questions = await prisma.question.findMany({
    where: { active: true, testType: session.testType },
    select: { id: true, order: true, skill: true, intelligence: true, reverse: true, scaleMax: true },
  });
  const validIds = new Set(questions.map((q) => q.id));
  const maxVal = session.testType === "student" ? 4 : 5;

  const answers = rawAnswers
    .filter((a) => validIds.has(a.questionId) && a.value >= 1 && a.value <= maxVal)
    .map((a) => ({ questionId: a.questionId, value: Math.round(a.value) }));

  if (answers.length < questions.length) {
    return NextResponse.json({ error: `All ${questions.length} questions must be answered.` }, { status: 400 });
  }

  const now = new Date();
  let kind: string;
  let totalScore: number;
  let data: unknown;

  if (session.testType === "student") {
    const qInputs: MIQuestionInput[] = questions.map((q) => ({
      id: q.id, order: q.order, intelligence: q.intelligence || "", reverse: q.reverse,
    }));
    const mi = computeMIReport(qInputs, answers, now.toISOString());
    kind = "student_mi";
    totalScore = mi.total;
    data = mi;
  } else {
    const qInputs: QuestionInput[] = questions.map((q) => ({
      id: q.id, order: q.order, skill: q.skill, reverse: q.reverse,
    }));
    const rep = computeReport(qInputs, answers as AnswerInput[], now.toISOString());
    kind = "employee_skills";
    totalScore = rep.totalScore;
    data = rep;
  }

  await prisma.$transaction([
    prisma.answer.deleteMany({ where: { sessionId: session.id } }),
    prisma.answer.createMany({
      data: answers.map((a) => ({
        sessionId: session.id,
        questionId: a.questionId,
        order: questions.find((q) => q.id === a.questionId)?.order ?? 0,
        value: a.value,
      })),
    }),
    prisma.testSession.update({
      where: { id: session.id },
      data: { status: "completed", language, completedAt: now },
    }),
    prisma.report.upsert({
      where: { sessionId: session.id },
      update: { totalScore, data: JSON.stringify(data), kind },
      create: { sessionId: session.id, totalScore, data: JSON.stringify(data), kind },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
