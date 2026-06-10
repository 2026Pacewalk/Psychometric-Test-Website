import { requireCompany } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";

const NAV: NavItem[] = [
  { label: "Overview", href: "/company", icon: "▦" },
  { label: "Employees", href: "/company/employees", icon: "👥" },
  { label: "Reports", href: "/company/reports", icon: "📄" },
  { label: "Company Profile", href: "/company/profile", icon: "🏢" },
];

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCompany();
  return (
    <Shell brand="Company Panel" subtitle={session.name} nav={NAV} userName={session.name}>
      {children}
    </Shell>
  );
}
