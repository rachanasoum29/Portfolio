import Link from "next/link";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AdminEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: AdminEmptyStateProps) {
  return (
    <div className="border border-line px-6 py-12 sm:px-8">
      <h2 className="text-xl font-medium tracking-[-0.03em]">{title}</h2>
      <p className="mt-3 max-w-lg leading-relaxed text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-8 inline-flex min-h-11 items-center text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text transition-colors hover:text-foreground"
        >
          {actionLabel}
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
