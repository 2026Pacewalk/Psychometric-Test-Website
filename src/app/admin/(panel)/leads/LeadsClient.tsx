"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface Note { at: string; by: string; text: string }
export interface LeadRow {
  id: string; type: string; source: string; name: string; email: string; phone: string;
  school: string; city: string; state: string; message: string; status: string;
  assignedTo: string; notes: Note[]; convertedType: string; createdAt: string;
}

const STATUSES = ["new", "contacted", "followup", "interested", "converted", "rejected", "closed"];
const STATUS_LABEL: Record<string, string> = {
  new: "New Lead", contacted: "Contacted", followup: "Follow Up", interested: "Interested",
  converted: "Converted", rejected: "Rejected", closed: "Closed",
};
const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-700", contacted: "bg-blue-100 text-blue-700",
  followup: "bg-indigo-100 text-indigo-700", interested: "bg-violet-100 text-violet-700",
  converted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  closed: "bg-slate-200 text-slate-600",
};
const TARGETS = [
  { key: "school", label: "School" }, { key: "company", label: "Company" },
  { key: "centre", label: "Study Centre" }, { key: "individual", label: "Individual User" },
];
function guessTarget(type: string) {
  if (["company"].includes(type)) return "company";
  if (["centre"].includes(type)) return "centre";
  if (["individual"].includes(type)) return "individual";
  if (["school", "enroll"].includes(type)) return "school";
  return "school";
}

export default function LeadsClient({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<LeadRow | null>(null);
  const [note, setNote] = useState("");
  const [assigned, setAssigned] = useState("");
  const [busy, setBusy] = useState(false);

  // convert modal
  const [conv, setConv] = useState<LeadRow | null>(null);
  const [cform, setCform] = useState<any>({});
  const [cerr, setCerr] = useState("");
  const [creds, setCreds] = useState<any>(null);

  const filtered = useMemo(() => rows.filter((r) => {
    if (status && r.status !== status) return false;
    if (q) { const t = q.toLowerCase(); return [r.name, r.email, r.phone, r.city, r.school].some((v) => v.toLowerCase().includes(t)); }
    return true;
  }), [rows, q, status]);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false); router.refresh();
  }
  function view(l: LeadRow) { setOpen(l); setNote(""); setAssigned(l.assignedTo); if (!l.notes) { /* */ } if (l.status === "new") patch(l.id, { read: true }); }
  async function addNote() { if (!open || !note.trim()) return; await patch(open.id, { note }); setNote(""); setOpen(null); }
  async function saveAssign() { if (!open) return; await patch(open.id, { assignedTo: assigned }); setOpen(null); }

  async function openConvert(l: LeadRow) {
    setOpen(null); setConv(l); setCerr(""); setCreds(null);
    const target = guessTarget(l.type);
    setCform({ target, username: "", password: "", name: l.name, email: l.email, phone: l.phone, city: l.city, state: l.state });
    const r = await fetch(`/api/admin/convert-suggest?target=${target}`);
    const d = await r.json().catch(() => ({}));
    setCform((f: any) => ({ ...f, username: d.username || "", password: d.password || "" }));
  }
  async function changeTarget(target: string) {
    setCform((f: any) => ({ ...f, target }));
    const r = await fetch(`/api/admin/convert-suggest?target=${target}`);
    const d = await r.json().catch(() => ({}));
    setCform((f: any) => ({ ...f, username: d.username || "", password: d.password || "" }));
  }
  async function doConvert(e: React.FormEvent) {
    e.preventDefault(); setCerr(""); setBusy(true);
    const res = await fetch(`/api/admin/leads/${conv!.id}/convert`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cform),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setCerr(d.error || "Could not convert.");
    setCreds(d); router.refresh();
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Leads & Inquiries</h1><p className="text-sm text-slate-500">Every website inquiry becomes a lead. Convert qualified leads into accounts.</p></div>

      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <input className="input max-w-xs" placeholder="Search name, email, phone, city…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Lead</th><th className="py-2 font-semibold">Mobile</th><th className="py-2 font-semibold">City</th><th className="py-2 font-semibold">Type</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7} className="py-10 text-center text-slate-400">No leads.</td></tr> : filtered.map((l) => (
                <tr key={l.id} className={`border-t border-slate-100 ${l.status === "new" ? "bg-amber-50/40" : ""}`}>
                  <td className="py-2.5"><p className="font-medium text-slate-800">{l.name}</p><p className="text-xs text-slate-400">#{l.id.slice(-6).toUpperCase()} · {l.email || "—"}</p></td>
                  <td className="py-2.5 text-slate-500">{l.phone || "—"}</td>
                  <td className="py-2.5 text-slate-500">{l.city || "—"}</td>
                  <td className="py-2.5 capitalize text-slate-500">{l.type}</td>
                  <td className="py-2.5"><span className={`badge ${STATUS_STYLE[l.status]}`}>{STATUS_LABEL[l.status] || l.status}</span></td>
                  <td className="py-2.5 text-slate-500">{new Date(l.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5 text-right"><button onClick={() => view(l)} className="font-semibold text-brand-600">Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {open && (
        <Modal title={open.name} onClose={() => setOpen(null)}>
          <div className="space-y-1 text-sm">
            <Row k="Lead ID" v={"#" + open.id.slice(-6).toUpperCase()} />
            <Row k="Inquiry Type" v={open.type} />
            <Row k="Source" v={open.source} />
            <Row k="Mobile" v={open.phone || "—"} />
            <Row k="Email" v={open.email || "—"} />
            <Row k="City / State" v={`${open.city || "—"} / ${open.state || "—"}`} />
            <Row k="Organisation" v={open.school || "—"} />
          </div>
          {open.message && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{open.message}</p>}

          {/* Quick contact actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {open.phone && <a href={`tel:${open.phone}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">📞 Call</a>}
            {open.phone && <a href={`https://wa.me/${open.phone.replace(/\D/g, "")}`} target="_blank" className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">WhatsApp</a>}
            {open.email && <a href={`mailto:${open.email}`} className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">✉ Email</a>}
          </div>

          {/* Status + assign */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><label className="label">Status</label>
              <select className="input" value={open.status} onChange={(e) => patch(open.id, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <div><label className="label">Assigned To</label>
              <div className="flex gap-2">
                <input className="input" value={assigned} onChange={(e) => setAssigned(e.target.value)} placeholder="name" />
                <button onClick={saveAssign} disabled={busy} className="btn-outline px-3 text-xs">Save</button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="label">Notes</label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {open.notes.length === 0 ? <p className="text-xs text-slate-400">No notes yet.</p> : open.notes.map((n, i) => (
                <div key={i} className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600"><span className="font-semibold">{n.by}</span> · {new Date(n.at).toLocaleString("en-GB")}<br />{n.text}</div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
              <button onClick={addNote} disabled={busy || !note.trim()} className="btn-outline px-3 text-xs">Add</button>
            </div>
          </div>

          {/* Convert / Reject */}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {open.status === "converted" ? (
              <span className="badge bg-green-100 text-green-700">Already converted to {open.convertedType}</span>
            ) : (
              <>
                <button onClick={() => openConvert(open)} className="btn-primary text-sm">Convert to Account →</button>
                <button onClick={() => { patch(open.id, { status: "rejected" }); setOpen(null); }} className="btn-outline text-sm text-red-600">Reject Lead</button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Convert modal */}
      {conv && (
        <Modal title={`Convert: ${conv.name}`} onClose={() => { setConv(null); setCreds(null); }}>
          {creds ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-green-50 p-4 text-sm">
                <p className="font-bold text-green-800">✓ {creds.role} account created!</p>
                <p className="mt-2 text-slate-600">Share these credentials with the user (they should change the password after first login):</p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <p>Login URL: <span className="font-bold">{origin}{creds.loginUrl}</span></p>
                  <p>Username: <span className="font-bold">{creds.username}</span></p>
                  <p>Temp Password: <span className="font-bold">{creds.password}</span></p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(`Login: ${origin}${creds.loginUrl}\nUsername: ${creds.username}\nPassword: ${creds.password}`)} className="btn-outline mt-3 text-xs">Copy credentials</button>
              </div>
              <button onClick={() => { setConv(null); setCreds(null); }} className="btn-primary text-sm">Done</button>
            </div>
          ) : (
            <form onSubmit={doConvert} className="space-y-3">
              <div>
                <label className="label">Convert to</label>
                <div className="flex flex-wrap gap-2">
                  {TARGETS.map((t) => (
                    <button type="button" key={t.key} onClick={() => changeTarget(t.key)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${cform.target === t.key ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name</label><input className="input" value={cform.name || ""} onChange={(e) => setCform({ ...cform, name: e.target.value })} /></div>
                <div><label className="label">Email *</label><input className="input" value={cform.email || ""} onChange={(e) => setCform({ ...cform, email: e.target.value })} /></div>
                {cform.target !== "individual" && (
                  <div><label className="label">Username / Code</label><input className="input" value={cform.username || ""} onChange={(e) => setCform({ ...cform, username: e.target.value })} /></div>
                )}
                <div><label className="label">Temp Password</label><input className="input" value={cform.password || ""} onChange={(e) => setCform({ ...cform, password: e.target.value })} /></div>
                <div><label className="label">Mobile</label><input className="input" value={cform.phone || ""} onChange={(e) => setCform({ ...cform, phone: e.target.value })} /></div>
                <div><label className="label">City</label><input className="input" value={cform.city || ""} onChange={(e) => setCform({ ...cform, city: e.target.value })} /></div>
              </div>
              {cform.target === "individual" && <p className="text-xs text-slate-400">Individual users log in with their email + the temp password.</p>}
              {cerr && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{cerr}</p>}
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setConv(null)} className="btn-outline text-sm">Cancel</button><button type="submit" disabled={busy} className="btn-primary text-sm">{busy ? "Creating…" : "Create Account"}</button></div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-slate-100 py-1.5"><span className="font-medium text-slate-500">{k}</span><span className="capitalize text-slate-800">{v}</span></div>;
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">{title}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button></div>
        {children}
      </div>
    </div>
  );
}
