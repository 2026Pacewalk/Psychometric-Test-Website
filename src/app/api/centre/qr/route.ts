import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Public: serves the admin-uploaded payment QR, or falls back to the bundled
// default QR (public/payment-qr.png) so a QR always shows for centres + individuals.
export async function GET() {
  const { qrImage } = await getSettings();

  if (qrImage) {
    try {
      const buf = await readFile(path.join(process.cwd(), "uploads", path.basename(qrImage)));
      const ext = path.extname(qrImage).toLowerCase();
      const type = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
      return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": type, "Cache-Control": "no-store" } });
    } catch {
      /* fall through to bundled default */
    }
  }

  try {
    const buf = await readFile(path.join(process.cwd(), "public", "payment-qr.png"));
    return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ error: "No QR available." }, { status: 404 });
  }
}
