import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Create Individual Account" };

export default async function IndividualRegisterPage() {
  const session = await getSession();
  if (session?.role === "individual") redirect("/individual/account");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Suspense>
        <AuthCard
          title="Create your account"
          subtitle="Register to take a test and access your reports anytime."
          endpoint="/api/auth/individual-register"
          redirectTo="/individual/account"
          fields={[
            { name: "name", label: "Full Name", autoComplete: "name" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "phone", label: "Mobile Number", autoComplete: "tel" },
            { name: "city", label: "City" },
            { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
          ]}
          footer={
            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/individual/login" className="font-semibold text-brand-600">Log in</Link>
            </p>
          }
        />
      </Suspense>
    </main>
  );
}
