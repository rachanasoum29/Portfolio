"use client";

import { arrowLinkClass } from "@/components/linkStyles";

const variants = {
  arrow: arrowLinkClass,
  quiet:
    "group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent-text",
  display:
    "group inline-flex min-h-11 max-w-full flex-wrap items-center gap-3 text-2xl font-medium tracking-[-0.03em] break-words transition-colors duration-200 hover:text-accent-text sm:text-4xl",
} as const;

export function PlaceholderLink({
  label,
  variant = "arrow",
  className = "",
}: {
  label: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <a
      href="#placeholder"
      className={`${variants[variant]} ${className}`}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      {label}
      <span aria-hidden="true" className="arrow-shift">
        ↗
      </span>
      <span className="sr-only"> (placeholder link)</span>
    </a>
  );
}
