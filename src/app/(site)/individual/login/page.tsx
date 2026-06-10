import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Individual Login" };

export default async function IndividualLoginPage() {
  const session = await getSession();
  if (session?.role === "individual") redirect("/individual/account");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Suspense>
        <AuthCard
          title="Individual Login"
          subtitle="Access your tests and reports."
          endpoint="/api/auth/individual-login"
          redirectTo="/individual/account"
          fields={[
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
          demo={{ label: "Use demo account (user@demo.in / user123)", values: { email: "user@demo.in", password: "user123" } }}
          footer={
            <p className="mt-5 text-center text-sm text-slate-500">
              New here?{" "}
              <Link href="/individual/register" className="font-semibold text-brand-600">Create an account</Link>
            </p>
          }
        />
      </Suspense>
    </main>
  );
}
