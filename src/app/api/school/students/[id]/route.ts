import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function owns(studentId: string, schoolId: string) {
  const s = await prisma.student.findUnique({ where: { id: studentId } });
  return s && s.schoolId === schoolId ? s : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "school")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await owns(params.id, session.sub)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  await prisma.student.update({
    where: { id: params.id },
    data: {
      name: str(b.name),
      fatherName: str(b.fatherName),
      motherName: str(b.motherName),
      mobile: str(b.mobile),
      otherMobile: str(b.otherMobile),
      dob: str(b.dob),
      classCourse: str(b.classCourse),
      qualification: str(b.qualification),
      address: str(b.address),
      category: str(b.category),
      aim: str(b.aim),
      venue: str(b.venue),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "school")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await owns(params.id, session.sub)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.student.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
