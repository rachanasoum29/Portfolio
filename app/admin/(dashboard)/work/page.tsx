import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { primaryButtonClass } from "@/components/linkStyles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Work",
};

type WorkPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

export default async function AdminWorkPage({ searchParams }: WorkPageProps) {
  const params = await searchParams;
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Projects
          </p>
          <p className="mt-2 max-w-xl text-muted">
            Create and manage work projects shown on the portfolio.
          </p>
        </div>
        <Link href="/admin/work/new" className={primaryButtonClass}>
          Add project
        </Link>
      </div>

      {params.saved ? (
        <p role="status" className="border border-line px-4 py-3 text-sm text-foreground">
          Project saved successfully.
        </p>
      ) : null}
      {params.deleted ? (
        <p role="status" className="border border-line px-4 py-3 text-sm text-foreground">
          Project deleted.
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="border border-line px-4 py-3 text-sm text-accent-text">
          Something went wrong. Try again.
        </p>
      ) : null}

      {projects.length === 0 ? (
        <AdminEmptyState
          title="No projects yet."
          description="Add your first project to start managing portfolio work."
          actionHref="/admin/work/new"
          actionLabel="Add project"
        />
      ) : (
        <ul className="divide-y divide-line border border-line">
          {projects.map((project) => (
            <li
              key={project.id}
              className="grid gap-4 px-4 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-6 sm:px-5"
            >
              <div className="relative aspect-square overflow-hidden border border-line bg-surface">
                {project.image ? (
                  // Admin preview only. Paths and remote URLs are both allowed.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.16em] text-muted">
                    No image
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-medium tracking-[-0.02em]">{project.title}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <span
                    className={
                      project.published ? "text-accent-text" : undefined
                    }
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                  <span>Order {project.order}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <Link
                  href={`/admin/work/${project.id}/edit`}
                  className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text transition-colors hover:text-foreground"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
