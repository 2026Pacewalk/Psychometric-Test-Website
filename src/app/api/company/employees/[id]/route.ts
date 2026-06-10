import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function owns(employeeId: string, companyId: string) {
  const e = await prisma.employee.findUnique({ where: { id: employeeId } });
  return e && e.companyId === companyId ? e : null;
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "company")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await owns(params.id, session.sub)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.employee.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
