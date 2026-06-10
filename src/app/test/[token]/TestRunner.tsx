"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SCORE_OPTIONS } from "@/lib/skills";
import { STUDENT_SCALE } from "@/lib/mi";

interface Q {
  id: string;
  order: number;
  textEn: string;
  textPa: string;
}
interface StudentForm {
  name: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  otherMobile: string;
  dob: string;
  classCourse: string;
  qualification: string;
  schoolNameRaw: string;
  address: string;
  category: string;
  aim: string;
  venue: string;
}

const FIELDS: { key: keyof StudentForm; label: string; pa: string; type?: string; required?: boolean; full?: boolean }[] = [
  { key: "name", label: "Student Name", pa: "ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ", required: true },
  { key: "fatherName", label: "Father Name", pa: "ਪਿਤਾ ਦਾ ਨਾਮ", required: true },
  { key: "motherName", label: "Mother Name", pa: "ਮਾਤਾ ਦਾ ਨਾਮ" },
  { key: "mobile", label: "Mobile Number", pa: "ਮੋਬਾਈਲ ਨੰਬਰ", required: true },
  { key: "otherMobile", label: "Other Mobile Number", pa: "ਹੋਰ ਮੋਬਾਈਲ ਨੰਬਰ" },
  { key: "dob", label: "Date of Birth (dd/mm/yyyy)", pa: "ਜਨਮ ਮਿਤੀ", required: true },
  { key: "classCourse", label: "Class / Course", pa: "ਕਲਾਸ / ਕੋਰਸ", required: true },
  { key: "qualification", label: "Qualification", pa: "ਯੋਗਤਾ" },
  { key: "schoolNameRaw", label: "School Name", pa: "ਸਕੂਲ ਦਾ ਨਾਮ" },
  { key: "address", label: "Address", pa: "ਪਤਾ", full: true },
  { key: "aim", label: "Aim / Career Goal", pa: "ਟੀਚਾ / ਕਰੀਅਰ ਟੀਚਾ" },
  { key: "venue", label: "Venue / Test Location", pa: "ਸਥਾਨ" },
];

export default function TestRunner({
  token,
  testType,
  scaleMax,
  orgName,
  collectDetails,
  student,
  questions,
  startStep,
}: {
  token: string;
  testType: "student" | "employee";
  scaleMax: number;
  orgName: string;
  collectDetails: boolean;
  student: StudentForm;
  questions: Q[];
  startStep: "details" | "test";
}) {
  const router = useRouter();
  const SCALE = scaleMax === 4 ? STUDENT_SCALE : SCORE_OPTIONS;
  const optionCols = scaleMax === 4 ? "sm:grid-cols-4" : "sm:grid-cols-5";
  const [step, setStep] = useState<"details" | "test">(startStep);
  const [lang, setLang] = useState<"en" | "pa">("en");
  const [form, setForm] = useState<StudentForm>(student);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const firstUnanswered = useMemo(
    () => questions.find((q) => !(q.id in answers)),
    [questions, answers]
  );

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    for (const f of FIELDS) {
      if (f.required && !String(form[f.key] || "").trim()) {
        setError(`Please fill: ${f.label}`);
        return;
      }
    }
    setSubmitting(true);
    const res = await fetch(`/api/test/${token}/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not save details.");
      return;
    }
    setStep("test");
    window.scrollTo({ top: 0 });
  }

  async function submitTest() {
    setError("");
    if (answeredCount < questions.length) {
      setError(
        lang === "en"
          ? `Please answer all questions. ${questions.length - answeredCount} remaining.`
          : `ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ। ${questions.length - answeredCount} ਬਾਕੀ।`
      );
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.order}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/test/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
      }),
    });
    if (!res.ok) {
      setSubmitting(false);
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Submission failed.");
      return;
    }
    router.push(`/report/${token}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/60 to-slate-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-bold text-brand-700">Psychometric Assessment</p>
            <p className="text-xs text-slate-500">{orgName}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-sm">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1 font-medium ${lang === "en" ? "bg-white shadow text-brand-700" : "text-slate-500"}`}
            >
              English
            </button>
            <button
              onClick={() => setLang("pa")}
              className={`font-pa rounded-full px-3 py-1 font-medium ${lang === "pa" ? "bg-white shadow text-brand-700" : "text-slate-500"}`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </div>
        {step === "test" && (
          <div className="h-1.5 w-full bg-slate-100">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </header>

      <div className="container-page max-w-4xl pt-8">
        {step === "details" ? (
          <form onSubmit={saveDetails} className="card p-6 sm:p-8 animate-fade-up">
            <h1 className="text-2xl font-bold text-slate-900">
              {lang === "en" ? "Student Details" : <span className="font-pa">ਵਿਦਿਆਰਥੀ ਵੇਰਵੇ</span>}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {lang === "en"
                ? "Please confirm your details before starting the test."
                : <span className="font-pa">ਟੈਸਟ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਵੇਰਵੇ ਪੁਸ਼ਟੀ ਕਰੋ।</span>}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                  <label className="label">
                    {lang === "en" ? f.label : <span className="font-pa">{f.pa}</span>}
                    {f.required && <span className="text-red-500"> *</span>}
                  </label>
                  <input
                    className="input"
                    value={form[f.key]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="label">
                  {lang === "en" ? "Category" : <span className="font-pa">ਸ਼੍ਰੇਣੀ</span>}
                </label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                >
                  {["GEN", "OBC", "SC", "OTHER"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto">
              {submitting ? "Saving…" : lang === "en" ? "Start Test →" : "ਟੈਸਟ ਸ਼ੁਰੂ ਕਰੋ →"}
            </button>
          </form>
        ) : (
          <div className="animate-fade-up">
            <div className="card mb-6 p-5">
              <h1 className="text-xl font-bold text-slate-900">
                {lang === "en" ? `Answer all ${questions.length} statements honestly` : <span className="font-pa">ਸਾਰੇ {questions.length} ਕਥਨਾਂ ਦੇ ਇਮਾਨਦਾਰੀ ਨਾਲ ਜਵਾਬ ਦਿਓ</span>}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {lang === "en"
                  ? "There are no right or wrong answers. Choose the option that best describes you."
                  : <span className="font-pa">ਕੋਈ ਸਹੀ ਜਾਂ ਗ਼ਲਤ ਜਵਾਬ ਨਹੀਂ ਹੈ। ਉਹ ਚੋਣ ਚੁਣੋ ਜੋ ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਦੱਸਦੀ ਹੈ।</span>}
              </p>
              <p className="mt-3 text-sm font-semibold text-brand-700">
                {answeredCount}/{questions.length} {lang === "en" ? "answered" : "ਜਵਾਬ ਦਿੱਤੇ"}
              </p>
            </div>

            <ol className="space-y-4">
              {questions.map((q) => (
                <li key={q.id} id={`q-${q.order}`} className="card p-5">
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {q.order}
                    </span>
                    <p className={`text-slate-800 ${lang === "pa" ? "font-pa" : ""}`}>
                      {lang === "en" ? q.textEn : q.textPa}
                    </p>
                  </div>
                  <div className={`mt-4 grid grid-cols-1 gap-2 ${optionCols}`}>
                    {SCALE.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))}
                          className={`rounded-xl border px-2 py-2 text-center text-xs font-medium transition ${
                            selected
                              ? "border-brand-600 bg-brand-600 text-white shadow"
                              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                          }`}
                        >
                          <span className="block text-base font-bold">{opt.value}</span>
                          <span className={lang === "pa" ? "font-pa" : ""}>
                            {lang === "en" ? opt.en : opt.pa}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ol>

            {error && <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="sticky bottom-4 mt-6">
              <button
                onClick={submitTest}
                disabled={submitting}
                className="btn-accent w-full text-base shadow-soft"
              >
                {submitting
                  ? "Generating report…"
                  : lang === "en"
                  ? "Submit & Generate Report"
                  : "ਜਮ੍ਹਾਂ ਕਰੋ ਅਤੇ ਰਿਪੋਰਟ ਬਣਾਓ"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
