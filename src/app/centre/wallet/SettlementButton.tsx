"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettlementButton({ pending }: { pending: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function request() {
    setBusy(true); setMsg("");
    const res = await fetch("/api/centre/settlement", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error || "Could not request settlement."); return; }
    setMsg(`Settlement requested for ₹${d.amount}.`);
    router.refresh();
  }

  return (
    <div>
      <button onClick={request} disabled={busy || pending <= 0} className="btn-primary text-sm">
        {busy ? "Requesting…" : `Request Settlement (₹${pending})`}
      </button>
      {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
