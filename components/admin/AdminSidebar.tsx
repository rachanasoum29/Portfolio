"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { adminNavItems, isAdminNavActive } from "@/components/admin/nav";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export function AdminSidebar({ open, onClose, email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-foreground/20 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-background transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-line px-5 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-text">
            Portfolio Admin
          </p>
          <p className="mt-2 truncate text-sm text-muted" title={email}>
            {email}
          </p>
        </div>
        <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {adminNavItems.map((item) => {
            const active = isAdminNavActive(
              pathname,
              item.href,
              "exact" in item ? item.exact : false,
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={`rounded-sm px-3 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "bg-surface text-accent-text"
                    : "text-muted hover:bg-surface/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line px-3 py-4">
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-sm px-3 py-2.5 text-left text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:bg-surface/60 hover:text-foreground"
            >
              Logout
            </button>
          </form>
          <Link
            href="/"
            className="mt-1 block rounded-sm px-3 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:bg-surface/60 hover:text-foreground"
            onClick={onClose}
          >
            View site
          </Link>
        </div>
      </aside>
    </>
  );
}
