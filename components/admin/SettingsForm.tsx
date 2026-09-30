"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsFormState } from "@/app/admin/(dashboard)/settings/actions";
import { primaryButtonClass } from "@/components/linkStyles";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-muted";

type SettingsFormProps = {
  initialValues: {
    name: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    cvUrl: string;
    websiteTitle: string;
    websiteDescription: string;
  };
};

const initialState: SettingsFormState = {};

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const [state, action, pending] = useActionState(updateSettings, initialState);

  const fields = [
    { id: "name", label: "Name", value: initialValues.name },
    { id: "email", label: "Email", value: initialValues.email, type: "email" },
    { id: "githubUrl", label: "GitHub", value: initialValues.githubUrl, type: "url" },
    { id: "linkedinUrl", label: "LinkedIn", value: initialValues.linkedinUrl, type: "url" },
    { id: "cvUrl", label: "CV URL", value: initialValues.cvUrl, type: "url" },
    { id: "websiteTitle", label: "Website title", value: initialValues.websiteTitle },
  ] as const;

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-7" noValidate>
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-3">
          <label htmlFor={field.id} className={labelClass}>
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={"type" in field ? field.type : "text"}
            defaultValue={field.value}
            className={fieldClass}
          />
          {state.fieldErrors?.[field.id] ? (
            <p role="alert" className="text-sm text-accent-text">
              {state.fieldErrors[field.id]}
            </p>
          ) : null}
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <label htmlFor="websiteDescription" className={labelClass}>
          Website description
        </label>
        <textarea
          id="websiteDescription"
          name="websiteDescription"
          rows={4}
          defaultValue={initialValues.websiteDescription}
          className={`${fieldClass} min-h-28 resize-y`}
        />
        {state.fieldErrors?.websiteDescription ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.websiteDescription}
          </p>
        ) : (
          <p className="text-sm text-muted">Also used as the homepage intro when set.</p>
        )}
      </div>

      {state.formError ? (
        <p role="alert" className="text-sm text-accent-text">
          {state.formError}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="border border-line px-4 py-3 text-sm">
          {state.success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-fit disabled:opacity-50`}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
