import { getAdminWithPermissions } from "@/lib/session-helpers";
import Shell, { NavItem } from "@/components/dashboard/Shell";
import { Permission } from "@/lib/permissions";

const ALL_NAV: (NavItem & { perm?: Permission })[] = [
  { label: "Overview", href: "/admin", icon: "overview" },

  { label: "Schools", href: "/admin/schools", icon: "school", perm: "schools", section: "Accounts" },
  { label: "Companies", href: "/admin/companies", icon: "company", perm: "companies", section: "Accounts" },
  { label: "Study Centres", href: "/admin/centres", icon: "centre", perm: "centres", section: "Accounts" },
  { label: "Individual Users", href: "/admin/individuals", icon: "user", perm: "individuals", section: "Accounts" },
  { label: "Students", href: "/admin/students", icon: "users", perm: "students", section: "Accounts" },

  { label: "Results & Reports", href: "/admin/results", icon: "report", perm: "results", section: "Assessments" },
  { label: "Questions & Scoring", href: "/admin/questions", icon: "questions", perm: "questions", section: "Assessments" },
  { label: "Career Suggestions", href: "/admin/careers", icon: "careers", perm: "careers", section: "Assessments" },

  { label: "Payments", href: "/admin/payments", icon: "card", perm: "payments", section: "Finance" },
  { label: "Payment Verification", href: "/admin/payment-verification", icon: "verify", perm: "payments", section: "Finance" },
  { label: "Pricing", href: "/admin/pricing", icon: "pricing", perm: "pricing", section: "Finance" },
  { label: "Joining Payments", href: "/admin/joining-payments", icon: "receipt", perm: "centres", section: "Finance" },
  { label: "Settlements", href: "/admin/settlements", icon: "settlements", perm: "centres", section: "Finance" },
  { label: "Payment Settings", href: "/admin/payment-settings", icon: "settings", perm: "centres", section: "Finance" },

  { label: "Leads & Inquiries", href: "/admin/leads", icon: "leads", perm: "leads", section: "Engagement" },
  { label: "Email Templates", href: "/admin/email-templates", icon: "email", perm: "content", section: "Engagement" },
  { label: "Website Content", href: "/admin/content", icon: "content", perm: "content", section: "Engagement" },

  { label: "Audit Trail", href: "/admin/audit", icon: "audit", perm: "audit", section: "System" },
  { label: "Admin Users", href: "/admin/admins", icon: "admins", perm: "admins", section: "System" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, permissions } = await getAdminWithPermissions();
  const nav = ALL_NAV.filter((n) => !n.perm || permissions.includes(n.perm));

  return (
    <Shell brand="Super Admin" subtitle="Control Center" nav={nav} userName={session.name} accent="dark" notifAllHref="/admin/notifications">
      {children}
    </Shell>
  );
}
