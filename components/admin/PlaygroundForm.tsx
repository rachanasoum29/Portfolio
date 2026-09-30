"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createPlaygroundItem,
  updatePlaygroundItem,
  type PlaygroundFormState,
} from "@/app/admin/(dashboard)/playground/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { primaryButtonClass } from "@/components/linkStyles";
import { slugify } from "@/lib/validation";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-muted";

export type PlaygroundFormValues = {
  title: string;
  slug: string;
  description: string;
  image: string;
  technology: string;
  order: number;
  published: boolean;
};

type PlaygroundFormProps = {
  mode: "create" | "edit";
  itemId?: string;
  initialValues: PlaygroundFormValues;
};

const initialState: PlaygroundFormState = {};

export function PlaygroundForm({ mode, itemId, initialValues }: PlaygroundFormProps) {
  const boundUpdate = updatePlaygroundItem.bind(null, itemId ?? "");
  const action = mode === "create" ? createPlaygroundItem : boundUpdate;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(initialValues.title);
  const [image, setImage] = useState(initialValues.image);
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
          className={fieldClass}
          aria-invalid={state.fieldErrors?.title ? true : undefined}
        />
        {state.fieldErrors?.title ? (
          <p role="alert" className="text-sm text-accent-text">
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
          value={slug}
          onChange={(e) => setSlugOverride(e.target.value)}
          required
          maxLength={80}
          className={fieldClass}
        />
        {state.fieldErrors?.slug ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.slug}
          </p>
        ) : (
          <p className="text-sm text-muted">Lowercase letters, numbers, and hyphens.</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          maxLength={5000}
          defaultValue={initialValues.description}
          className={`${fieldClass} min-h-32 resize-y`}
        />
        {state.fieldErrors?.description ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.description}
          </p>
        ) : null}
      </div>

      <ImageUpload
        folder="playground"
        value={image}
        onChange={setImage}
        error={state.fieldErrors?.image}
      />

      <div className="flex flex-col gap-3">
        <label htmlFor="technology" className={labelClass}>
          Technology
        </label>
        <input
          id="technology"
          name="technology"
          defaultValue={initialValues.technology}
          maxLength={80}
          className={fieldClass}
        />
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
          className={fieldClass}
        />
        {state.fieldErrors?.order ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.order}
          </p>
        ) : (
          <p className="text-sm text-muted">Lower numbers appear first.</p>
        )}
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initialValues.published}
          className="size-4 accent-[var(--accent)]"
        />
        Published
      </label>

      {state.formError ? (
        <p role="alert" className="text-sm text-accent-text">
          {state.formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" disabled={pending} className={`${primaryButtonClass} disabled:opacity-50`}>
          {pending ? "Saving…" : mode === "create" ? "Create item" : "Save changes"}
        </button>
        <Link
          href="/admin/playground"
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
