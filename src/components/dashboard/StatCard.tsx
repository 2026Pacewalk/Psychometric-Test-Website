import Link from "next/link";

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
    brand: "bg-brand-50 text-brand-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };

  const inner = (
    <>
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="truncate text-sm text-slate-500">{label}</p>
      </div>
      {href && (
        <span className="ml-auto text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" aria-hidden>
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        {inner}
      </Link>
    );
  }

  return <div className="card flex items-center gap-4 p-5">{inner}</div>;
}
