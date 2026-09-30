import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaygroundForm } from "@/components/admin/PlaygroundForm";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.playgroundItem.findUnique({
    where: { id },
    select: { title: true },
  });
  return { title: item ? `Edit ${item.title}` : "Edit playground item" };
}

export default async function EditPlaygroundPage({ params }: PageProps) {
  const { id } = await params;
  const item = await prisma.playgroundItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Playground</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Edit item</h2>
      </div>
      <PlaygroundForm
        mode="edit"
        itemId={item.id}
        initialValues={{
          title: item.title,
          slug: item.slug,
          description: item.description,
          image: item.image ?? "",
          technology: item.technology,
          order: item.order,
          published: item.published,
        }}
      />
    </div>
  );
}
