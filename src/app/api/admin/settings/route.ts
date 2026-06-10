import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { guardAdmin } from "@/lib/api-guard";
import { setSetting, SETTING_KEYS } from "@/lib/settings";

export async function POST(req: NextRequest) {
  const g = await guardAdmin("centres");
  if ("error" in g) return g.error;

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form." }, { status: 400 });

  const fee = parseInt(String(form.get("joiningFee") || ""), 10);
  if (Number.isFinite(fee) && fee >= 0) await setSetting(SETTING_KEYS.joiningFee, String(fee));
  await setSetting(SETTING_KEYS.upiId, String(form.get("upiId") || "").trim());
  await setSetting(SETTING_KEYS.upiName, String(form.get("upiName") || "").trim());

  const qr = form.get("qr") as File | null;
  if (qr && typeof qr === "object" && qr.size > 0) {
    if (qr.size > 3 * 1024 * 1024) return NextResponse.json({ error: "QR image must be under 3 MB." }, { status: 400 });
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    const ext = path.extname(qr.name).toLowerCase() || ".png";
    const fname = `qr_${Date.now()}${ext}`;
    await writeFile(path.join(dir, fname), Buffer.from(await qr.arrayBuffer()));
    await setSetting(SETTING_KEYS.qrImage, fname);
  }

  return NextResponse.json({ ok: true });
}
