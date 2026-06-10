import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "School Login",
  description: "Secure login for enrolled schools to manage students, tests and reports.",
};

export default async function SchoolLoginPage() {
  const session = await getSession();
  if (session?.role === "school") redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 px-4 py-12">
      <Suspense>
        <AuthCard
          title="School Login"
          subtitle="Access your school dashboard, students and reports."
          endpoint="/api/auth/school-login"
          redirectTo="/dashboard"
          fields={[
            { name: "code", label: "School Code or Email", placeholder: "e.g. DEMO01", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
          demo={{ label: "Use demo credentials (DEMO01 / school123)", values: { code: "DEMO01", password: "school123" } }}
          footer={
            <p className="mt-5 text-center text-sm text-slate-500">
              Not enrolled yet?{" "}
              <Link href="/how-to-enroll" className="font-semibold text-brand-600 hover:text-brand-700">
                Enroll your school
              </Link>
            </p>
          }
        />
      </Suspense>
    </main>
  );
}
