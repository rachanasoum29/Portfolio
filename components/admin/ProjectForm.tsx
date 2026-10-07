"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/app/admin/(dashboard)/work/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { primaryButtonClass } from "@/components/linkStyles";
import { slugify } from "@/lib/validation";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";

const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-muted";

export type ProjectFormValues = {
  title: string;
  slug: string;
  description: string;
  image?: string;
  laptopImage?: string;
  mobileImage?: string;
  technologies: string;
  year: string;
  order: number;
  published: boolean;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialValues: ProjectFormValues;
};

const initialState: ProjectFormState = {};

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const boundUpdate = updateProject.bind(null, projectId ?? "");
  const action = mode === "create" ? createProject : boundUpdate;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(initialValues.title);
  const [laptopImage, setLaptopImage] = useState(
    initialValues.laptopImage || initialValues.image || "",
  );
  const [mobileImage, setMobileImage] = useState(
    initialValues.mobileImage || "",
  );
  const [slugOverride, setSlugOverride] = useState<string | null>(
    mode === "edit" ? initialValues.slug : null,
  );
  const slug = slugOverride ?? slugify(title);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-7" noValidate>
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={state.fieldErrors?.title ? true : undefined}
          aria-describedby={state.fieldErrors?.title ? "title-error" : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.title ? (
          <p id="title-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="slug" className={labelClass}>
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          maxLength={80}
          value={slug}
          onChange={(event) => {
            setSlugOverride(event.target.value);
          }}
          aria-invalid={state.fieldErrors?.slug ? true : undefined}
          aria-describedby={state.fieldErrors?.slug ? "slug-error" : "slug-hint"}
          className={fieldClass}
        />
        {state.fieldErrors?.slug ? (
          <p id="slug-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.slug}
          </p>
        ) : (
          <p id="slug-hint" className="text-sm text-muted">
            Used in URLs. Lowercase letters, numbers, and hyphens.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          defaultValue={initialValues.description}
          aria-invalid={state.fieldErrors?.description ? true : undefined}
          aria-describedby={state.fieldErrors?.description ? "description-error" : undefined}
          className={`${fieldClass} min-h-32 resize-y`}
        />
        {state.fieldErrors?.description ? (
          <p id="description-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.description}
          </p>
        ) : null}
      </div>

      <input type="hidden" name="image" value={laptopImage} />

      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface/20 p-5 sm:p-6">
        <div>
          <h3 className="text-sm font-medium tracking-tight text-foreground">Device Mockup Images</h3>
          <p className="mt-1 text-xs text-muted">
            Upload distinct images for the desktop preview (laptop) and mobile mockup (phone).
          </p>
        </div>

        <ImageUpload
          name="laptopImage"
          label="Laptop preview image (Desktop)"
          value={laptopImage}
          onChange={setLaptopImage}
          error={state.fieldErrors?.laptopImage || state.fieldErrors?.image}
          folder="projects"
        />

        <div className="border-t border-line pt-6">
          <ImageUpload
            name="mobileImage"
            label="Mobile mockup image (Phone)"
            value={mobileImage}
            onChange={setMobileImage}
            error={state.fieldErrors?.mobileImage}
            folder="projects"
          />
          {!mobileImage ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>Tip: Upload a portrait screenshot captured in mobile view.</span>
              <button
                type="button"
                onClick={() =>
                  setMobileImage("/uploads/projects/1791353440846-8b048b2e4413.jpg")
                }
                className="font-mono text-accent-text underline hover:text-foreground"
              >
                Click to attach uploaded mobile screenshot
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="technologies" className={labelClass}>
          Technologies
        </label>
        <input
          id="technologies"
          name="technologies"
          type="text"
          defaultValue={initialValues.technologies}
          aria-invalid={state.fieldErrors?.technologies ? true : undefined}
          aria-describedby={
            state.fieldErrors?.technologies ? "technologies-error" : "technologies-hint"
          }
          className={fieldClass}
        />
        {state.fieldErrors?.technologies ? (
          <p id="technologies-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.technologies}
          </p>
        ) : (
          <p id="technologies-hint" className="text-sm text-muted">
            Comma-separated, for example Next.js, TypeScript, PostgreSQL
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="year" className={labelClass}>
          Year
        </label>
        <input
          id="year"
          name="year"
          type="text"
          maxLength={40}
          defaultValue={initialValues.year}
          aria-invalid={state.fieldErrors?.year ? true : undefined}
          aria-describedby={state.fieldErrors?.year ? "year-error" : "year-hint"}
          className={fieldClass}
        />
        {state.fieldErrors?.year ? (
          <p id="year-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.year}
          </p>
        ) : (
          <p id="year-hint" className="text-sm text-muted">
            Optional. Shown on the project card, for example 2026 or 2025 — 2026
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="order" className={labelClass}>
          Order
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={initialValues.order}
          aria-invalid={state.fieldErrors?.order ? true : undefined}
          aria-describedby={state.fieldErrors?.order ? "order-error" : "order-hint"}
          className={fieldClass}
        />
        {state.fieldErrors?.order ? (
          <p id="order-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.order}
          </p>
        ) : (
          <p id="order-hint" className="text-sm text-muted">
            Lower numbers appear first.
          </p>
        )}
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initialValues.published}
          className="size-4 border border-line accent-[var(--accent)]"
        />
        Published
      </label>

      {state.formError ? (
        <p role="alert" className="text-sm text-accent-text">
          {state.formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          className={`${primaryButtonClass} disabled:pointer-events-none disabled:opacity-50`}
          disabled={pending}
        >
          {pending ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
        </button>
        <Link
          href="/admin/work"
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
