"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BNItem { label: string; href: string; icon: string }

export default function MobileBottomNav({ items }: { items: BNItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link key={item.href} href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${active ? "text-brand-700" : "text-slate-500"}`}>
            <span className={`text-lg ${active ? "scale-110" : ""} transition`}>{item.icon}</span>
            <span className="max-w-full truncate px-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
