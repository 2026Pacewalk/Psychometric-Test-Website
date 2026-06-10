import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public endpoint: enrollment + contact form submissions.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const allowed = ["enroll", "school", "contact", "company", "centre", "individual", "demo", "callback"];
  const type = allowed.includes(b.type) ? b.type : "contact";
  const source = str(b.source) || "website";

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!str(b.phone) && !str(b.email))
    return NextResponse.json({ error: "Please provide a phone or email." }, { status: 400 });

  await prisma.lead.create({
    data: {
      type,
      source,
      name,
      email: str(b.email) || null,
      phone: str(b.phone) || null,
      school: str(b.school) || null,
      city: str(b.city) || null,
      state: str(b.state) || null,
      message: str(b.message) || null,
    },
  });

  return NextResponse.json({ ok: true });
}
