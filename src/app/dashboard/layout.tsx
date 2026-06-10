import { requireSchool } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";

const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "▦" },
  { label: "Students", href: "/dashboard/students", icon: "👥" },
  { label: "Reports", href: "/dashboard/reports", icon: "📄" },
  { label: "School Profile", href: "/dashboard/profile", icon: "🏫" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSchool();
  return (
    <Shell brand="School Panel" subtitle={session.name} nav={NAV} userName={session.name}>
      {children}
    </Shell>
  );
}
