import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "New project",
};

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Work</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Add project</h2>
      </div>
      <ProjectForm
        mode="create"
        initialValues={{
          title: "",
          slug: "",
          description: "",
          image: "",
          technologies: "",
          year: "",
          order: 0,
          published: false,
        }}
      />
    </div>
  );
}
