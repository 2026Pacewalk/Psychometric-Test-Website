"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REG_TYPES = ["Proprietorship", "Partnership", "Private Limited", "Trust", "Society", "Not Registered", "Other"];

export default function CentreApplyForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("password")) !== String(fd.get("confirm"))) {
      setError("Passwords do not match.");
      return;
    }
    setStatus("saving");
    const res = await fetch("/api/centre/apply", { method: "POST", body: fd });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(d.error || "Could not submit application."); setStatus("error"); return; }
    // Auto-logged-in — go straight to the dashboard to complete payment.
    router.push("/centre");
    router.refresh();
  }

  const Field = ({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input name={name} type={type} required={required} className="input" />
    </div>
  );

  return (
    <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8">
      <div>
        <h3 className="text-base font-bold text-slate-900">Centre Details</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="name" label="Centre Name" required />
          <Field name="ownerName" label="Owner Name" />
          <Field name="mobile" label="Mobile Number" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="city" label="City" />
          <Field name="district" label="District" />
          <Field name="state" label="State" />
          <Field name="existingInstitute" label="Existing Institute Name" />
          <div>
            <label className="label">Registration Type</label>
            <select name="registrationType" className="input">
              <option value="">Select…</option>
              {REG_TYPES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <Field name="expectedStudents" label="Expected Students Per Month" type="number" />
          <div className="sm:col-span-2"><label className="label">Full Address</label><input name="address" className="input" /></div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-base font-bold text-slate-900">Documents</h3>
        <label className="label mt-3">Upload Document <span className="text-slate-400">(ID / registration proof, optional, max 5 MB)</span></label>
        <input name="document" type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700" />
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-base font-bold text-slate-900">Create Login</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="label">Password *</label><input name="password" type="password" required minLength={6} className="input" /></div>
          <div><label className="label">Confirm Password *</label><input name="confirm" type="password" required minLength={6} className="input" /></div>
        </div>
        <p className="mt-2 text-xs text-slate-400">After submitting, you'll be logged in to your dashboard to complete the next steps.</p>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <label className="label">Message</label>
        <textarea name="message" rows={2} className="input" />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === "saving"} className="btn-primary w-full sm:w-auto">
        {status === "saving" ? "Creating account…" : "Apply for Authorised Study Centre"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already applied? <a href="/centre-login" className="font-semibold text-brand-600">Log in to your dashboard</a>
      </p>
    </form>
  );
}
