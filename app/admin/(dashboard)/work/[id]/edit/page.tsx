import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: project ? `Edit ${project.title}` : "Edit project",
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Work</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Edit project</h2>
      </div>
      <ProjectForm
        mode="edit"
        projectId={project.id}
        initialValues={{
          title: project.title,
          slug: project.slug,
          description: project.description,
          image: project.image ?? "",
          technologies: project.technologies.join(", "),
          order: project.order,
          published: project.published,
        }}
      />
    </div>
  );
}
