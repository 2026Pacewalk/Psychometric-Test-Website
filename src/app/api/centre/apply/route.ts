import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { notifyAdmin } from "@/lib/notify";

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = "AC" + randomBytes(2).toString("hex").toUpperCase();
    const exists = await prisma.studyCentre.findUnique({ where: { code } });
    if (!exists) return code;
  }
  return "AC" + Date.now().toString().slice(-6);
}

// Public study-centre SIGNUP. Creates an account with status "payment_pending"
// and logs the centre in so they can pay the joining fee from their dashboard.
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const str = (k: string) => String(form.get(k) || "").trim();
  const name = str("name");
  const email = str("email").toLowerCase();
  const mobile = str("mobile");
  const password = str("password");

  if (!name || !email || !mobile)
    return NextResponse.json({ error: "Centre name, email and mobile are required." }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Please set a password of at least 6 characters." }, { status: 400 });

  const existing = await prisma.studyCentre.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });

  let documentPath: string | undefined;
  const doc = form.get("document") as File | null;
  if (doc && typeof doc === "object" && doc.size > 0) {
    if (doc.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Document must be under 5 MB." }, { status: 400 });
    const dir = path.join(process.cwd(), "uploads");
    await mkdir(dir, { recursive: true });
    const safe = doc.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fname = `doc_${Date.now()}_${safe}`;
    await writeFile(path.join(dir, fname), Buffer.from(await doc.arrayBuffer()));
    documentPath = fname;
  }

  const expected = parseInt(str("expectedStudents"), 10);
  const code = await uniqueCode();

  const centre = await prisma.studyCentre.create({
    data: {
      name, code, email, passwordHash: await bcrypt.hash(password, 10),
      ownerName: str("ownerName"), mobile,
      city: str("city"), district: str("district"), state: str("state"),
      address: str("address"), existingInstitute: str("existingInstitute"),
      registrationType: str("registrationType"),
      expectedStudents: Number.isFinite(expected) ? expected : null,
      documentPath, message: str("message"),
      status: "payment_pending",
    },
  });

  await prisma.lead.create({
    data: { type: "centre", name, email, phone: mobile, city: str("city"), message: `Study Centre signup — ${str("existingInstitute") || name} (payment pending)` },
  });

  await notifyAdmin("centre_application", "New Study Centre application", `${name} (${centre.code})`, "/admin/centres");

  // Auto-login so the centre can pay from the dashboard.
  await createSession({ sub: centre.id, role: "centre", name: centre.name, email: centre.email });

  return NextResponse.json({ ok: true, code });
}
