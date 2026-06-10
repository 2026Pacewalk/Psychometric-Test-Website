import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Public: streams the admin-uploaded payment QR image.
export async function GET() {
  const { qrImage } = await getSettings();
  if (!qrImage) return NextResponse.json({ error: "No QR uploaded." }, { status: 404 });
  const safe = path.basename(qrImage);
  try {
    const buf = await readFile(path.join(process.cwd(), "uploads", safe));
    const ext = path.extname(safe).toLowerCase();
    const type = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
    return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": type, "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
