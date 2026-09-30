"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  email: string;
  children: React.ReactNode;
};

export function AdminLayout({ email, children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const mobileOpen = menuPath === pathname;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        open={mobileOpen}
        onClose={() => setMenuPath(null)}
        email={email}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenuOpen={() => setMenuPath(pathname)} />
        <div className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
