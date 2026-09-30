"use client";

import { useActionState } from "react";
import { primaryButtonClass } from "@/components/linkStyles";
import { login, type LoginState } from "@/app/admin/login/actions";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-10 flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-3">
        <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.email ? (
          <p id="email-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.password ? (
          <p id="password-error" role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>
      {state.formError ? (
        <p role="alert" className="text-sm text-accent-text">
          {state.formError}
        </p>
      ) : null}
      <button
        type="submit"
        className={`${primaryButtonClass} mt-2 w-fit max-w-full disabled:pointer-events-none disabled:opacity-50`}
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
