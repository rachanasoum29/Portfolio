import type { Metadata } from "next";
import { PlaygroundForm } from "@/components/admin/PlaygroundForm";

export const metadata: Metadata = { title: "New playground item" };

export default function NewPlaygroundPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Playground</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Add item</h2>
      </div>
      <PlaygroundForm
        mode="create"
        initialValues={{
          title: "",
          slug: "",
          description: "",
          image: "",
          technology: "",
          order: 0,
          published: false,
        }}
      />
    </div>
  );
}
