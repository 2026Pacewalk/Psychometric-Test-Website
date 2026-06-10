import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { logAudit, clientIp } from "@/lib/audit";
import { notifyAdmin } from "@/lib/notify";
import { ConvertTarget, LOGIN_URL, nextCode, tempPassword } from "@/lib/convert";

const TARGETS = ["school", "company", "centre", "individual"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;

  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  if (lead.status === "converted") return NextResponse.json({ error: "Lead is already converted." }, { status: 409 });

  const b = await req.json().catch(() => ({}));
  const target = b.target as ConvertTarget;
  if (!TARGETS.includes(target)) return NextResponse.json({ error: "Choose a valid account type." }, { status: 400 });

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name) || lead.name;
  const email = str(b.email).toLowerCase() || (lead.email || "").toLowerCase();
  const phone = str(b.phone) || lead.phone || "";
  const city = str(b.city) || lead.city || "";
  const state = str(b.state) || lead.state || "";
  const password = str(b.password) || tempPassword();
  let username = str(b.username);

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email) return NextResponse.json({ error: "Email is required to create the account." }, { status: 400 });
  if (target !== "individual" && !username) username = await nextCode(target);

  const passwordHash = await bcrypt.hash(password, 10);
  let createdId = "";
  let loginUsername = username;

  try {
    if (target === "school") {
      const c = await prisma.school.create({
        data: { name, code: username.toUpperCase(), email, passwordHash, phone, city, state, status: "approved" },
      });
      createdId = c.id; loginUsername = c.code;
    } else if (target === "company") {
      const c = await prisma.company.create({
        data: { name, code: username.toUpperCase(), email, passwordHash, phone, city, state, status: "approved" },
      });
      createdId = c.id; loginUsername = c.code;
    } else if (target === "centre") {
      const c = await prisma.studyCentre.create({
        data: { name, code: username.toUpperCase(), email, passwordHash, ownerName: name, mobile: phone, city, state, status: "active", commissionPercent: 30 },
      });
      createdId = c.id; loginUsername = c.code;
    } else {
      const c = await prisma.individualUser.create({
        data: { name, email, passwordHash, phone, city },
      });
      createdId = c.id; loginUsername = c.email;
    }
  } catch (e: any) {
    if (e?.code === "P2002")
      return NextResponse.json({ error: "That code or email is already in use. Edit it and try again." }, { status: 409 });
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "converted", convertedType: target, convertedId: createdId, read: true },
  });

  await logAudit({
    session: g.session, action: "lead.convert", entity: "lead", entityId: lead.id,
    details: { target, createdId, username: loginUsername, leadName: lead.name },
    ip: clientIp(req),
  });

  await notifyAdmin("lead_converted", `Lead converted to ${target}`, `${name} (${loginUsername})`, "/admin/leads");

  return NextResponse.json({
    ok: true, role: target, username: loginUsername, password, loginUrl: LOGIN_URL[target],
  });
}
