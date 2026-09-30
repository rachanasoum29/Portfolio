"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks } from "@/data/site";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  function toggleMenu() {
    setOpenPath(open ? null : pathname);
  }

  useEffect(() => {
    const content = document.getElementById("content");
    const footer = document.querySelector("footer");

    if (content instanceof HTMLElement) {
      content.inert = open;
    }
    if (footer instanceof HTMLElement) {
      footer.inert = open;
    }

    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      if (content instanceof HTMLElement) {
        content.inert = false;
      }
      if (footer instanceof HTMLElement) {
        footer.inert = false;
      }
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background">
        <Container className="flex h-14 items-center justify-between gap-6">
          <Link href="/" aria-label="Rachana Soum" className="inline-flex shrink-0">
            <Image
              src="/images/logo.png"
              alt=""
              width={251}
              height={256}
              priority
              className="h-9 w-auto dark:invert"
            />
          </Link>
          <div className="flex items-center gap-6 lg:gap-8">
            <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative py-1 text-[12px] font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-200 ${
                      active ? "text-accent-text" : "text-muted hover:text-accent-text"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-end px-1 text-[12px] font-medium uppercase tracking-[0.16em] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={toggleMenu}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </Container>
      </header>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-background lg:hidden"
        >
          <Container className="flex flex-col py-4">
            {navLinks.map((link, index) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 items-baseline gap-4 border-b border-line py-5 text-[2.4rem] leading-none font-medium tracking-[-0.03em] ${
                    active ? "text-accent-text" : "text-muted"
                  }`}
                >
                  <span className="font-mono text-sm text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      ) : null}
    </>
  );
}
