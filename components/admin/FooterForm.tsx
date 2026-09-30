"use client";

import { useActionState } from "react";
import { updateFooter, type FooterFormState } from "@/app/admin/(dashboard)/footer/actions";
import { primaryButtonClass } from "@/components/linkStyles";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-muted";

type FooterFormProps = {
  initialValues: {
    facebookUrl: string;
    instagramUrl: string;
    footerYear: string;
    name: string;
  };
};

const initialState: FooterFormState = {};

export function FooterForm({ initialValues }: FooterFormProps) {
  const [state, action, pending] = useActionState(updateFooter, initialState);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-7" noValidate>
      <div className="border border-line px-5 py-4 text-sm text-muted">
        Footer brand name uses Settings:{" "}
        <span className="text-foreground">{initialValues.name || "—"}</span>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="facebookUrl" className={labelClass}>
          Facebook URL
        </label>
        <input
          id="facebookUrl"
          name="facebookUrl"
          type="url"
          defaultValue={initialValues.facebookUrl}
          placeholder="https://"
          className={fieldClass}
        />
        {state.fieldErrors?.facebookUrl ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.facebookUrl}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="instagramUrl" className={labelClass}>
          Instagram URL
        </label>
        <input
          id="instagramUrl"
          name="instagramUrl"
          type="url"
          defaultValue={initialValues.instagramUrl}
          placeholder="https://"
          className={fieldClass}
        />
        {state.fieldErrors?.instagramUrl ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.instagramUrl}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="footerYear" className={labelClass}>
          Copyright year
        </label>
        <input
          id="footerYear"
          name="footerYear"
          type="text"
          inputMode="numeric"
          maxLength={4}
          defaultValue={initialValues.footerYear}
          className={fieldClass}
        />
        {state.fieldErrors?.footerYear ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.footerYear}
          </p>
        ) : (
          <p className="text-sm text-muted">Shown as © year next to your name.</p>
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

      <button
        type="submit"
        disabled={pending}
        className={`${primaryButtonClass} w-fit disabled:opacity-50`}
      >
        {pending ? "Saving…" : "Save footer"}
      </button>
    </form>
  );
}
