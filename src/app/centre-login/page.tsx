import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Study Centre Login" };

export default async function CentreLoginPage() {
  const session = await getSession();
  if (session?.role === "centre") redirect("/centre");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4 py-12">
      <Suspense>
        <AuthCard
          title="Study Centre Login"
          subtitle="Access your centre dashboard, tests, reports and wallet."
          endpoint="/api/auth/centre-login"
          redirectTo="/centre"
          fields={[
            { name: "code", label: "Centre Code or Email", placeholder: "e.g. AC001", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
          demo={{ label: "Use demo credentials (AC001 / centre123)", values: { code: "AC001", password: "centre123" } }}
          footer={
            <p className="mt-5 text-center text-sm text-slate-500">
              Want to partner with us?{" "}
              <Link href="/become-study-centre" className="font-semibold text-brand-600 hover:text-brand-700">Become a Study Centre</Link>
            </p>
          }
        />
      </Suspense>
    </main>
  );
}
