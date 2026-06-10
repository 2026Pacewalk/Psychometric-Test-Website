import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("payments");
  if ("error" in g) return g.error;
  const p = await prisma.payment.findUnique({ where: { id: params.id } });
  if (!p?.proofPath) return NextResponse.json({ error: "No proof." }, { status: 404 });
  const safe = path.basename(p.proofPath);
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", safe));
    const ext = path.extname(safe).toLowerCase();
    const type = ext === ".pdf" ? "application/pdf" : ext === ".png" ? "image/png" : "image/jpeg";
    return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": type, "Content-Disposition": `inline; filename="${safe}"` } });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
