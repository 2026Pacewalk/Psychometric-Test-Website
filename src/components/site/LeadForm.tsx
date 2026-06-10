"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

export default function LeadForm({ type }: { type: "enroll" | "contact" | "company" }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("saving");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h3 className="text-xl font-bold text-slate-900">Thank you!</h3>
        <p className="mt-2 text-slate-600">
          We have received your {type === "enroll" ? "enrollment request" : "message"} and will get back to you shortly.
        </p>
        <a
          href={whatsappLink(
            `Hi, I just submitted ${type === "enroll" ? "an enrollment request" : "a contact form"} on your website. My name is ${form.name || ""}.`
          )}
          target="_blank"
          className="btn-accent mt-5"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Your Name *</label>
          <input className="input" value={form.name || ""} onChange={set("name")} required />
        </div>
        <div>
          <label className="label">Phone / Mobile</label>
          <input className="input" value={form.phone || ""} onChange={set("phone")} placeholder="WhatsApp number preferred" />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email || ""} onChange={set("email")} />
        </div>
        <div>
          <label className="label">City</label>
          <input className="input" value={form.city || ""} onChange={set("city")} />
        </div>
        {type !== "contact" && (
          <div className="sm:col-span-2">
            <label className="label">{type === "company" ? "Company Name" : "School Name"}</label>
            <input className="input" value={form.school || ""} onChange={set("school")} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="label">{type === "contact" ? "Message" : "Number of people / message"}</label>
          <textarea className="input" rows={4} value={form.message || ""} onChange={set("message")} />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <p className="text-xs text-slate-400">Provide at least a phone or email so we can reach you.</p>

      <button type="submit" disabled={status === "saving"} className="btn-primary w-full sm:w-auto">
        {status === "saving" ? "Sending…" : type === "contact" ? "Send Message" : type === "company" ? "Register Company Interest" : "Submit Enrollment Request"}
      </button>
    </form>
  );
}
