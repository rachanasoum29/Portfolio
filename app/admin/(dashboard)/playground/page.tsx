import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { DeletePlaygroundButton } from "@/components/admin/DeletePlaygroundButton";
import { primaryButtonClass } from "@/components/linkStyles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Playground" };

type PageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

export default async function AdminPlaygroundPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const items = await prisma.playgroundItem.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Items</p>
          <p className="mt-2 max-w-xl text-muted">
            Create and manage playground experiments shown on the portfolio.
          </p>
        </div>
        <Link href="/admin/playground/new" className={primaryButtonClass}>
          Add item
        </Link>
      </div>

      {params.saved ? (
        <p role="status" className="border border-line px-4 py-3 text-sm">
          Playground item saved successfully.
        </p>
      ) : null}
      {params.deleted ? (
        <p role="status" className="border border-line px-4 py-3 text-sm">
          Playground item deleted.
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="border border-line px-4 py-3 text-sm text-accent-text">
          Something went wrong. Try again.
        </p>
      ) : null}

      {items.length === 0 ? (
        <AdminEmptyState
          title="No playground items yet."
          description="Add your first experiment to start managing the playground."
          actionHref="/admin/playground/new"
          actionLabel="Add item"
        />
      ) : (
        <ul className="divide-y divide-line border border-line">
          {items.map((item) => (
            <li
              key={item.id}
              className="grid gap-4 px-4 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-6 sm:px-5"
            >
              <div className="aspect-square overflow-hidden border border-line bg-surface">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.16em] text-muted">
                    No image
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-medium tracking-[-0.02em]">{item.title}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <span className={item.published ? "text-accent-text" : undefined}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                  <span>Order {item.order}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <Link
                  href={`/admin/playground/${item.id}/edit`}
                  className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text hover:text-foreground"
                >
                  Edit
                </Link>
                <DeletePlaygroundButton id={item.id} title={item.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
