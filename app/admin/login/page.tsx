import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-text">Portfolio</p>
      <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em]">Admin login</h1>
      <p className="mt-3 leading-relaxed text-muted">Sign in to manage the portfolio.</p>
      <LoginForm />
      <Link href="/" className="mt-10 text-sm text-muted transition-colors hover:text-foreground">
        Back to site
      </Link>
    </div>
  );
}
