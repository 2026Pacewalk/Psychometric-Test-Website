import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await prisma.testSession.findUnique({
    where: { token: params.token },
  });
  if (!session) return NextResponse.json({ error: "Invalid test link." }, { status: 404 });
  if (session.status === "completed")
    return NextResponse.json({ error: "Test already completed." }, { status: 409 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (!str(b.name)) return NextResponse.json({ error: "Student name is required." }, { status: 400 });
  if (!session.studentId) {
    // Non-student session: just mark started.
    await prisma.testSession.update({
      where: { id: session.id },
      data: { status: "in_progress", startedAt: session.startedAt ?? new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.student.update({
    where: { id: session.studentId },
    data: {
      name: str(b.name),
      fatherName: str(b.fatherName),
      motherName: str(b.motherName),
      mobile: str(b.mobile),
      otherMobile: str(b.otherMobile),
      dob: str(b.dob),
      classCourse: str(b.classCourse),
      qualification: str(b.qualification),
      schoolNameRaw: str(b.schoolNameRaw),
      address: str(b.address),
      category: str(b.category) || "GEN",
      aim: str(b.aim),
      venue: str(b.venue),
    },
  });

  await prisma.testSession.update({
    where: { id: session.id },
    data: { status: "in_progress", startedAt: session.startedAt ?? new Date() },
  });

  return NextResponse.json({ ok: true });
}
