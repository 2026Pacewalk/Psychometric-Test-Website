import { requireCompany } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";

const NAV: NavItem[] = [
  { label: "Overview", href: "/company", icon: "overview" },
  { label: "Employees", href: "/company/employees", icon: "users" },
  { label: "Reports", href: "/company/reports", icon: "report" },
  { label: "Company Profile", href: "/company/profile", icon: "company" },
];

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCompany();
  return (
    <Shell brand="Company Panel" subtitle={session.name} nav={NAV} userName={session.name}>
      {children}
    </Shell>
  );
}
