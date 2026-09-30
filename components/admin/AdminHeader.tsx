"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { adminTitleForPath } from "@/components/admin/nav";

type AdminHeaderProps = {
  onMenuOpen: () => void;
};

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = adminTitleForPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-background px-5 sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center text-[12px] font-medium uppercase tracking-[0.16em] text-muted lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuOpen}
        >
          Menu
        </button>
        <h1 className="truncate text-lg font-medium tracking-[-0.03em]">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
