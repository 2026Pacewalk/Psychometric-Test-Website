import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function describe(a: { action: string; details: string | null }): string {
  let d: any = {};
  try { d = a.details ? JSON.parse(a.details) : {}; } catch { /* */ }
  switch (a.action) {
    case "lead.convert": return `Lead "${d.leadName || ""}" converted to ${d.target} (username ${d.username})`;
    case "lead.status": return `Lead status changed: ${d.prev} → ${d.next}`;
    case "lead.delete": return `Lead deleted`;
    default: return a.action;
  }
}

export default async function AuditPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("audit")) redirect("/admin");

  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Audit Trail</h1>
        <p className="text-sm text-slate-500">Immutable activity log — who did what, when, and from where. This log is never deleted.</p>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr><th className="py-2 font-semibold">Date &amp; Time</th><th className="py-2 font-semibold">Actor</th><th className="py-2 font-semibold">Action</th><th className="py-2 font-semibold">IP</th></tr>
          </thead>
          <tbody>
            {logs.length === 0 ? <tr><td colSpan={4} className="py-10 text-center text-slate-400">No activity logged yet.</td></tr> : logs.map((a) => (
              <tr key={a.id} className="border-t border-slate-100 align-top">
                <td className="py-2.5 whitespace-nowrap text-slate-500">{new Date(a.createdAt).toLocaleString("en-GB")}</td>
                <td className="py-2.5 text-slate-700">{a.actorName || "—"}<span className="block text-xs text-slate-400 capitalize">{a.actorRole || ""}</span></td>
                <td className="py-2.5 text-slate-700">{describe(a)}</td>
                <td className="py-2.5 font-mono text-xs text-slate-400">{a.ip || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
