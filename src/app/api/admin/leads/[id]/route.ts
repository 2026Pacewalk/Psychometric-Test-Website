import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardAdmin } from "@/lib/api-guard";
import { logAudit, clientIp } from "@/lib/audit";

const STATUSES = ["new", "contacted", "followup", "interested", "converted", "rejected", "closed"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;

  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};

  if (typeof b.status === "string" && STATUSES.includes(b.status)) data.status = b.status;
  if (typeof b.read === "boolean") data.read = b.read;
  if (typeof b.assignedTo === "string") data.assignedTo = b.assignedTo.trim();

  // Append a note
  if (typeof b.note === "string" && b.note.trim()) {
    const notes = (() => { try { return JSON.parse(lead.notes || "[]"); } catch { return []; } })();
    notes.push({ at: new Date().toISOString(), by: g.session.name || "Admin", text: b.note.trim() });
    data.notes = JSON.stringify(notes);
  }

  await prisma.lead.update({ where: { id: lead.id }, data });

  if (data.status && data.status !== lead.status) {
    await logAudit({
      session: g.session, action: "lead.status", entity: "lead", entityId: lead.id,
      details: { prev: lead.status, next: data.status }, ip: clientIp(req),
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;
  await prisma.lead.delete({ where: { id: params.id } });
  await logAudit({ session: g.session, action: "lead.delete", entity: "lead", entityId: params.id, ip: clientIp(req) });
  return NextResponse.json({ ok: true });
}
