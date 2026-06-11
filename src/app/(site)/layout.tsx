import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import MobileBottomNav, { BNItem } from "@/components/site/MobileBottomNav";
import { getSession } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const individual = session?.role === "individual";

  const items: BNItem[] = individual
    ? [
        { label: "Home", href: "/", icon: "🏠" },
        { label: "Tests", href: "/individual", icon: "📝" },
        { label: "Account", href: "/individual/account", icon: "▦" },
        { label: "Sample", href: "/sample-report", icon: "📄" },
        { label: "Contact", href: "/contact", icon: "✉" },
      ]
    : [
        { label: "Home", href: "/", icon: "🏠" },
        { label: "Schools", href: "/for-schools", icon: "🏫" },
        { label: "Companies", href: "/for-companies", icon: "🏢" },
        { label: "Individual", href: "/individual", icon: "👤" },
        { label: "Contact", href: "/contact", icon: "✉" },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex-1 pb-16 lg:pb-0">{children}</div>
      {/* Footer hidden on mobile (bottom nav replaces it for an app feel) */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileBottomNav items={items} />
    </div>
  );
}
