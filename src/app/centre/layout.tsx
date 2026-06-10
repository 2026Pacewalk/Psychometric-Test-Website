import { requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import Shell, { NavItem } from "@/components/dashboard/Shell";
import { CENTRE_LOGIN_STATUSES } from "@/lib/centre";

export const dynamic = "force-dynamic";

export default async function CentreLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCentre();
  const centre = await prisma.studyCentre.findUnique({ where: { id: session.sub }, select: { status: true } });
  const active = !!centre && CENTRE_LOGIN_STATUSES.includes(centre.status);

  const nav: NavItem[] = active
    ? [
        { label: "Overview", href: "/centre", icon: "▦" },
        { label: "Conduct Test", href: "/centre/tests", icon: "📝" },
        { label: "Wallet & Settlements", href: "/centre/wallet", icon: "👛" },
        { label: "Billing & Payment", href: "/centre/billing", icon: "💳" },
        { label: "Centre Profile", href: "/centre/profile", icon: "🏬" },
      ]
    : [
        { label: "Overview", href: "/centre", icon: "▦" },
        { label: "Joining Fee Payment", href: "/centre/billing", icon: "💳" },
        { label: "Centre Profile", href: "/centre/profile", icon: "🏬" },
      ];

  return (
    <Shell brand="Study Centre" subtitle={session.name} nav={nav} userName={session.name}>
      {children}
    </Shell>
  );
}
