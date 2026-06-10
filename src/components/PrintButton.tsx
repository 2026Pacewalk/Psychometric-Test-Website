"use client";

export default function PrintButton({ label = "🖨 Print / Save as PDF" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-primary text-sm no-print">
      {label}
    </button>
  );
}
