"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/app/admin/upload/actions";

type ImageUploadProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  folder?: "projects" | "playground" | "about";
  label?: string;
};

export function ImageUpload({
  name = "image",
  value,
  onChange,
  error,
  folder = "projects",
  label = "Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      setUploadError(null);
      const result = await uploadImage(formData);
      if (result.error) {
        setUploadError(result.error);
        return;
      }
      if (result.url) {
        onChange(result.url);
      }
    });
  }

  const message = error || uploadError;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">{label}</p>
      <input type="hidden" name={name} value={value} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="sr-only"
        onChange={onFileChange}
      />

      {value ? (
        <div className="overflow-hidden border border-line">
          {/* Preview for local or uploaded paths */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="max-h-64 w-full object-cover" />
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center border border-dashed border-line px-4 text-sm text-muted">
          No image selected
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={openPicker}
          disabled={pending}
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text transition-colors hover:text-foreground disabled:opacity-50"
        >
          {pending ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              onChange("");
            }}
            disabled={pending}
            className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent-text disabled:opacity-50"
          >
            Remove image
          </button>
        ) : null}
      </div>

      {message ? (
        <p role="alert" className="text-sm text-accent-text">
          {message}
        </p>
      ) : (
        <p className="text-sm text-muted">JPG, PNG, WebP, GIF, or SVG. Max 5MB.</p>
      )}
    </div>
  );
}
