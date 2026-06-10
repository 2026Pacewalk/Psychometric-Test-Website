import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "school")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student || student.schoolId !== session.sub)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Reuse an existing not-completed session if present.
  let testSession = await prisma.testSession.findFirst({
    where: { studentId: student.id, status: { in: ["pending", "in_progress"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!testSession) {
    testSession = await prisma.testSession.create({
      data: {
        studentId: student.id,
        token: randomUUID().replace(/-/g, ""),
        status: "pending",
        testType: "student",
        audience: "school",
      },
    });
  }

  return NextResponse.json({ ok: true, token: testSession.token });
}
