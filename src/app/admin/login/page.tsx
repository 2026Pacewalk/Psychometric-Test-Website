import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession, isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session && isAdmin(session.role)) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <Suspense>
        <AuthCard
          title="Super Admin"
          subtitle="Administrator access only."
          endpoint="/api/auth/admin-login"
          redirectTo="/admin"
          accent="slate"
          fields={[
            { name: "email", label: "Email", type: "email", placeholder: "admin@mindmetric.in", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
          demo={{ label: "Use demo admin (admin@mindmetric.in / admin123)", values: { email: "admin@mindmetric.in", password: "admin123" } }}
        />
      </Suspense>
    </main>
  );
}
