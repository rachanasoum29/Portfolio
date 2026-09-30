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
  parseTechnologies,
  slugify,
} from "@/lib/validation";

export type ProjectFormState = {
  formError?: string;
  fieldErrors?: Partial<
    Record<"title" | "slug" | "description" | "image" | "technologies" | "year" | "order", string>
  >;
};

type ProjectInput = {
  title: string;
  slug: string;
  description: string;
  image: string | null;
  technologies: string[];
  year: string;
  order: number;
  published: boolean;
};

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

function readProjectInput(formData: FormData): {
  values: ProjectInput | null;
  fieldErrors: ProjectFormState["fieldErrors"];
} {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const technologiesRaw = String(formData.get("technologies") ?? "");
  const year = String(formData.get("year") ?? "").trim();
  const orderRaw = String(formData.get("order") ?? "");
  const published = formData.get("published") === "on";

  const fieldErrors: ProjectFormState["fieldErrors"] = {};

  if (!title) {
    fieldErrors.title = "Enter a title.";
  } else if (title.length > 120) {
    fieldErrors.title = "Title must be 120 characters or fewer.";
  }

  if (!slug) {
    fieldErrors.slug = "Enter a slug.";
  } else if (!isValidSlug(slug)) {
    fieldErrors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }

  if (!description) {
    fieldErrors.description = "Enter a description.";
  } else if (description.length > 5000) {
    fieldErrors.description = "Description must be 5000 characters or fewer.";
  }

  if (image && !isManagedUploadPath(image) && !isValidOptionalImagePath(image)) {
    fieldErrors.image = "Upload an image or clear the current one.";
  }

  if (technologiesRaw.length > 500) {
    fieldErrors.technologies = "Technologies list is too long.";
  }

  if (year.length > 40) {
    fieldErrors.year = "Year must be 40 characters or fewer.";
  }

  const order = parseOrder(orderRaw);
  if (order === null) {
    fieldErrors.order = "Enter a whole number between -9999 and 9999.";
  }

  if (Object.keys(fieldErrors).length > 0 || order === null) {
    return { values: null, fieldErrors };
  }

  return {
    values: {
      title,
      slug,
      description,
      image: image || null,
      technologies: parseTechnologies(technologiesRaw),
      year,
      order,
      published,
    },
    fieldErrors,
  };
}

function isUniqueSlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function createProject(
  _state: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const { values, fieldErrors } = readProjectInput(formData);
  if (!values) {
    return { fieldErrors };
  }

  try {
    await prisma.project.create({
      data: {
        ...values,
        githubUrl: null,
        liveUrl: null,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return { fieldErrors: { slug: "That slug is already in use." } };
    }
    console.error("Create project failed", error);
    return { formError: "Could not save the project. Try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath("/");
  revalidatePath("/work");
  redirect("/admin/work?saved=1");
}

export async function updateProject(
  id: string,
  _state: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  if (!id) {
    return { formError: "Project not found." };
  }

  const existing = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return { formError: "Project not found." };
  }

  const { values, fieldErrors } = readProjectInput(formData);
  if (!values) {
    return { fieldErrors };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: values,
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return { fieldErrors: { slug: "That slug is already in use." } };
    }
    console.error("Update project failed", error);
    return { formError: "Could not save the project. Try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath(`/admin/work/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/work");
  redirect("/admin/work?saved=1");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/work?error=1");
  }

  try {
    await prisma.project.delete({ where: { id } });
  } catch {
    console.error("Delete project failed");
    redirect("/admin/work?error=1");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/work");
  revalidatePath("/");
  revalidatePath("/work");
  redirect("/admin/work?deleted=1");
}
