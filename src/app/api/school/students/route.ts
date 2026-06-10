import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "school")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  if (!str(b.name)) return NextResponse.json({ error: "Student name is required." }, { status: 400 });

  const student = await prisma.student.create({
    data: {
      schoolId: session.sub,
      name: str(b.name),
      fatherName: str(b.fatherName),
      motherName: str(b.motherName),
      mobile: str(b.mobile),
      otherMobile: str(b.otherMobile),
      dob: str(b.dob),
      classCourse: str(b.classCourse),
      qualification: str(b.qualification),
      schoolNameRaw: str(b.schoolNameRaw) || session.name,
      address: str(b.address),
      category: str(b.category) || "GEN",
      aim: str(b.aim),
      venue: str(b.venue),
    },
  });
  return NextResponse.json({ ok: true, student });
}
