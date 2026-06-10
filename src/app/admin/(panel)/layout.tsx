import { getAdminWithPermissions } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";
import { Permission } from "@/lib/permissions";

const ALL_NAV: (NavItem & { perm?: Permission })[] = [
  { label: "Overview", href: "/admin", icon: "▦" },
  { label: "Schools", href: "/admin/schools", icon: "🏫", perm: "schools" },
  { label: "Companies", href: "/admin/companies", icon: "🏢", perm: "companies" },
  { label: "Study Centres", href: "/admin/centres", icon: "🏬", perm: "centres" },
  { label: "Joining Payments", href: "/admin/joining-payments", icon: "🧾", perm: "centres" },
  { label: "Settlements", href: "/admin/settlements", icon: "🤝", perm: "centres" },
  { label: "Payment Settings", href: "/admin/payment-settings", icon: "⚙", perm: "centres" },
  { label: "Individual Users", href: "/admin/individuals", icon: "👤", perm: "individuals" },
  { label: "Students", href: "/admin/students", icon: "👥", perm: "students" },
  { label: "Results & Reports", href: "/admin/results", icon: "📄", perm: "results" },
  { label: "Payments", href: "/admin/payments", icon: "💳", perm: "payments" },
  { label: "Pricing", href: "/admin/pricing", icon: "💰", perm: "pricing" },
  { label: "Questions & Scoring", href: "/admin/questions", icon: "❓", perm: "questions" },
  { label: "Career Suggestions", href: "/admin/careers", icon: "🎯", perm: "careers" },
  { label: "Website Content", href: "/admin/content", icon: "📝", perm: "content" },
  { label: "Leads & Inquiries", href: "/admin/leads", icon: "📥", perm: "leads" },
  { label: "Admin Users", href: "/admin/admins", icon: "🛡", perm: "admins" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, permissions } = await getAdminWithPermissions();
  const nav = ALL_NAV.filter((n) => !n.perm || permissions.includes(n.perm));

  return (
    <Shell brand="Super Admin" subtitle="Control Center" nav={nav} userName={session.name} accent="dark">
      {children}
    </Shell>
  );
}
