import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const centre = await prisma.studyCentre.findUnique({ where: { id: params.id } });
  if (!centre?.documentPath) return NextResponse.json({ error: "No document." }, { status: 404 });

  const safe = path.basename(centre.documentPath);
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", safe));
    const ext = path.extname(safe).toLowerCase();
    const type = ext === ".pdf" ? "application/pdf" : ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": type, "Content-Disposition": `inline; filename="${safe}"` },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
