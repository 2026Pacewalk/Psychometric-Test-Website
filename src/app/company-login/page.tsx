import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Company Login",
  description: "Secure login for registered companies to assess employees and manage reports.",
};

export default async function CompanyLoginPage() {
  const session = await getSession();
  if (session?.role === "company") redirect("/company");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4 py-12">
      <Suspense>
        <AuthCard
          title="Company Login"
          subtitle="Access your company dashboard, employees and reports."
          endpoint="/api/auth/company-login"
          redirectTo="/company"
          fields={[
            { name: "code", label: "Company Code or Email", placeholder: "e.g. CORP01", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
          demo={{ label: "Use demo credentials (CORP01 / company123)", values: { code: "CORP01", password: "company123" } }}
          footer={
            <p className="mt-5 text-center text-sm text-slate-500">
              Want to register your company?{" "}
              <Link href="/for-companies" className="font-semibold text-brand-600 hover:text-brand-700">Register here</Link>
            </p>
          }
        />
      </Suspense>
    </main>
  );
}
