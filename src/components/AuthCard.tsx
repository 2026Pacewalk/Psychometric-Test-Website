"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export default function AuthCard({
  title,
  subtitle,
  endpoint,
  fields,
  redirectTo,
  accent = "brand",
  footer,
  demo,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: Field[];
  redirectTo: string;
  accent?: "brand" | "slate";
  footer?: React.ReactNode;
  demo?: { label: string; values: Record<string, string> };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      const next = params.get("next") || redirectTo;
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="label" htmlFor={f.name}>
                {f.label}
              </label>
              <input
                id={f.name}
                className="input"
                type={f.type || "text"}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                value={values[f.name] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.name]: e.target.value }))
                }
                required
              />
            </div>
          ))}

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={accent === "brand" ? "btn-primary w-full" : "btn w-full bg-slate-900 text-white hover:bg-slate-800"}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {demo && (
          <button
            type="button"
            onClick={() => setValues(demo.values)}
            className="mt-3 w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500 hover:border-brand-400 hover:text-brand-600"
          >
            {demo.label}
          </button>
        )}

        {footer}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
