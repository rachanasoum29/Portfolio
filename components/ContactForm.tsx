"use client";

import { type FormEvent, useState } from "react";
import { primaryButtonClass } from "@/components/linkStyles";
import { popStyle } from "@/components/popStyle";

type FieldName = "name" | "email" | "subject" | "message";

const fields: {
  name: FieldName;
  label: string;
  type?: string;
  autoComplete: string;
  multiline?: boolean;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
  { name: "message", label: "Message", autoComplete: "off", multiline: true },
];

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";

export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [notice, setNotice] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = validate(data);
    setErrors(next);

    const firstInvalid = fields.find((field) => next[field.name]);
    if (firstInvalid) {
      setNotice("");
      event.currentTarget.querySelector<HTMLElement>(`#contact-${firstInvalid.name}`)?.focus();
      return;
    }

    setNotice("This form is a preview and does not send messages.");
  }

  return (
    <form noValidate className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="sr-only">Send a message</h2>
      {fields.map((field) => {
        const error = errors[field.name];
        const errorId = `contact-${field.name}-error`;
        const shared = {
          id: `contact-${field.name}`,
          name: field.name,
          autoComplete: field.autoComplete,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          className: field.multiline ? `${fieldClass} min-h-32 resize-y` : fieldClass,
        };

        return (
          <div key={field.name} className="pop flex flex-col gap-3" style={popStyle(5 + fields.indexOf(field))}>
            <label
              htmlFor={shared.id}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
            >
              {field.label}
            </label>
            {field.multiline ? (
              <textarea {...shared} rows={4} />
            ) : (
              <input {...shared} type={field.type} />
            )}
            {error ? (
              <p id={errorId} role="alert" className="text-sm text-accent-text">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
      <button type="submit" className={`${primaryButtonClass} pop mt-2 w-fit max-w-full`} style={popStyle(9)}>
        Send Message
        <span aria-hidden="true" className="arrow-shift">
          →
        </span>
      </button>
      {notice ? (
        <p id="contact-notice" role="status" className="text-sm text-muted">
          {notice}
        </p>
      ) : null}
    </form>
  );
}

function validate(data: FormData) {
  const errors: Partial<Record<FieldName, string>> = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const subject = String(data.get("subject") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!subject) errors.subject = "Enter a subject.";
  if (!message) errors.message = "Enter a message.";

  return errors;
}
