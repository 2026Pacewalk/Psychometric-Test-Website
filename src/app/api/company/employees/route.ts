import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "company")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  if (!str(b.name)) return NextResponse.json({ error: "Employee name is required." }, { status: 400 });

  const employee = await prisma.employee.create({
    data: {
      companyId: session.sub,
      name: str(b.name),
      email: str(b.email),
      mobile: str(b.mobile),
      designation: str(b.designation),
      department: str(b.department),
      dob: str(b.dob),
      address: str(b.address),
    },
  });
  return NextResponse.json({ ok: true, employee });
}
