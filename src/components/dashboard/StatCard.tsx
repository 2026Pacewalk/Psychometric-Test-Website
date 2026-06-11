import Link from "next/link";
import NavIcon from "@/components/dashboard/NavIcon";

export default function StatCard({
  label,
  value,
  icon,
  tone = "brand",
  href,
}: {
  label: string;
  value: string | number;
  icon: string;
  tone?: "brand" | "green" | "amber" | "violet";
  href?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  const inner = (
    <>
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <NavIcon name={icon} className="h-[22px] w-[22px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[26px] font-extrabold leading-tight tracking-tight text-slate-900">{value}</p>
        <p className="truncate text-[13px] font-medium text-slate-500">{label}</p>
      </div>
      {href && (
        <span className="ml-auto text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" aria-hidden>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </span>
      )}
    </>
  );

  const shell = "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  if (href) {
    return (
      <Link
        href={href}
        className={`${shell} group transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={shell}>{inner}</div>;
}
