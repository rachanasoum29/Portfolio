"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isManagedUploadPath } from "@/lib/uploads";
import {
  isValidOptionalImagePath,
  isValidSlug,
  parseOrder,
  slugify,
} from "@/lib/validation";

export type PlaygroundFormState = {
  formError?: string;
  fieldErrors?: Partial<
    Record<"title" | "slug" | "description" | "image" | "technology" | "order", string>
  >;
};

type PlaygroundInput = {
  title: string;
  slug: string;
  description: string;
  image: string | null;
  technology: string;
  order: number;
  published: boolean;
};

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
}

function readInput(formData: FormData): {
  values: PlaygroundInput | null;
  fieldErrors: PlaygroundFormState["fieldErrors"];
} {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const technology = String(formData.get("technology") ?? "").trim();
  const orderRaw = String(formData.get("order") ?? "");
  const published = formData.get("published") === "on";
  const fieldErrors: PlaygroundFormState["fieldErrors"] = {};

  if (!title) fieldErrors.title = "Enter a title.";
  else if (title.length > 120) fieldErrors.title = "Title must be 120 characters or fewer.";

  if (!slug) fieldErrors.slug = "Enter a slug.";
  else if (!isValidSlug(slug)) fieldErrors.slug = "Use lowercase letters, numbers, and hyphens only.";

  if (!description) fieldErrors.description = "Enter a description.";
  else if (description.length > 5000) fieldErrors.description = "Description must be 5000 characters or fewer.";

  if (image && !isManagedUploadPath(image) && !isValidOptionalImagePath(image)) {
    fieldErrors.image = "Upload an image or clear the current one.";
  }

  if (technology.length > 80) fieldErrors.technology = "Technology must be 80 characters or fewer.";

  const order = parseOrder(orderRaw);
  if (order === null) fieldErrors.order = "Enter a whole number between -9999 and 9999.";

  if (Object.keys(fieldErrors).length > 0 || order === null) {
    return { values: null, fieldErrors };
  }

  return {
    values: {
      title,
      slug,
      description,
      image: image || null,
      technology,
      order,
      published,
    },
    fieldErrors,
  };
}

function isUniqueSlugError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createPlaygroundItem(
  _state: PlaygroundFormState,
  formData: FormData,
): Promise<PlaygroundFormState> {
  await requireAdmin();
  const { values, fieldErrors } = readInput(formData);
  if (!values) return { fieldErrors };

  try {
    await prisma.playgroundItem.create({ data: { ...values, demoUrl: null } });
  } catch (error) {
    if (isUniqueSlugError(error)) return { fieldErrors: { slug: "That slug is already in use." } };
    console.error("Create playground item failed");
    return { formError: "Could not save the item. Try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/playground");
  revalidatePath("/playground");
  redirect("/admin/playground?saved=1");
}

export async function updatePlaygroundItem(
  id: string,
  _state: PlaygroundFormState,
  formData: FormData,
): Promise<PlaygroundFormState> {
  await requireAdmin();
  if (!id) return { formError: "Item not found." };

  const existing = await prisma.playgroundItem.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { formError: "Item not found." };

  const { values, fieldErrors } = readInput(formData);
  if (!values) return { fieldErrors };

  try {
    await prisma.playgroundItem.update({ where: { id }, data: values });
  } catch (error) {
    if (isUniqueSlugError(error)) return { fieldErrors: { slug: "That slug is already in use." } };
    console.error("Update playground item failed");
    return { formError: "Could not save the item. Try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/playground");
  revalidatePath("/playground");
  redirect("/admin/playground?saved=1");
}

export async function deletePlaygroundItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/playground?error=1");

  try {
    await prisma.playgroundItem.delete({ where: { id } });
  } catch {
    redirect("/admin/playground?error=1");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/playground");
  revalidatePath("/playground");
  redirect("/admin/playground?deleted=1");
}
