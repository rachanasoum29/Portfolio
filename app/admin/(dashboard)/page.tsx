import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  let projectCount = 0;
  let playgroundCount = 0;
  let publishedProjects = 0;
  let publishedPlayground = 0;
  let recentProjects: { id: string; title: string; published: boolean; updatedAt: Date }[] = [];
  let dbError: string | null = null;

  try {
    const results = await Promise.all([
      prisma.project.count(),
      prisma.playgroundItem.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.playgroundItem.count({ where: { published: true } }),
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          published: true,
          updatedAt: true,
        },
      }),
    ]);
    [projectCount, playgroundCount, publishedProjects, publishedPlayground, recentProjects] = results;
  } catch (error) {
    console.error("Admin dashboard database error:", error);
    dbError = "Database connection error. Please verify your DATABASE_URL in Vercel settings.";
  }

  const publishedItems = publishedProjects + publishedPlayground;
  const draftItems = projectCount + playgroundCount - publishedItems;

  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Playground items", value: playgroundCount },
    { label: "Published items", value: publishedItems },
    { label: "Draft items", value: draftItems },
  ];

  return (
    <div className="space-y-10">
      {dbError ? (
        <div className="border border-accent-text/40 bg-accent/10 p-4 text-sm text-accent-text">
          {dbError}
        </div>
      ) : null}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Overview</p>
        <p className="mt-2 max-w-xl text-muted">
          A quick look at portfolio content. Management screens for each section will follow.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line px-5 py-6">
            <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
              {stat.label}
            </dt>
            <dd className="mt-3 text-3xl font-medium tracking-[-0.03em]">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="recent-projects-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="recent-projects-heading" className="text-xl font-medium tracking-[-0.03em]">
            Recent projects
          </h2>
          <Link
            href="/admin/work"
            className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text transition-colors hover:text-foreground"
          >
            Manage work
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <AdminEmptyState
            title="No projects yet."
            description="Work projects will show up here after you add them."
            actionHref="/admin/work"
            actionLabel="Go to work"
          />
        ) : (
          <ul className="divide-y divide-line border border-line">
            {recentProjects.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium tracking-[-0.02em]">{project.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    Updated {project.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-medium uppercase tracking-[0.16em] ${
                    project.published ? "text-accent-text" : "text-muted"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
