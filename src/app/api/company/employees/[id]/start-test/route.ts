import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "company")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee || employee.companyId !== session.sub)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  let testSession = await prisma.testSession.findFirst({
    where: { employeeId: employee.id, status: { in: ["pending", "in_progress"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!testSession) {
    testSession = await prisma.testSession.create({
      data: {
        employeeId: employee.id,
        token: randomUUID().replace(/-/g, ""),
        status: "pending",
        testType: "employee",
        audience: "company",
      },
    });
  }
  return NextResponse.json({ ok: true, token: testSession.token });
}
