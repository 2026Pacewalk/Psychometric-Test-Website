import { requireSchool } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";

const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Students", href: "/dashboard/students", icon: "users" },
  { label: "Reports", href: "/dashboard/reports", icon: "report" },
  { label: "School Profile", href: "/dashboard/profile", icon: "school" },
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
