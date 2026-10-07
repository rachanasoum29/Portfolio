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

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be 5MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      setUploadError(null);
      try {
        const result = await uploadImage(formData);
        if (result.error) {
          setUploadError(result.error);
          return;
        }
        if (result.url) {
          onChange(result.url);
        }
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Upload failed. Please try a smaller image.",
        );
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
        <div className="space-y-1">
          <div className="overflow-hidden border border-line">
            {/* Preview for local or uploaded paths */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="max-h-64 w-full object-cover" />
          </div>
          <p className="truncate font-mono text-[11px] text-muted">{value}</p>
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center border border-dashed border-line px-4 text-sm text-muted">
          No image selected
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={openPicker}
          disabled={pending}
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-accent-text transition-colors hover:text-foreground disabled:opacity-50"
        >
          {pending ? "Uploading…" : value ? "Replace image" : "Upload file"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowUrlInput(!showUrlInput);
            setUrlInputValue(value || "");
          }}
          disabled={pending}
          className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent-text disabled:opacity-50"
        >
          {showUrlInput ? "Hide path/URL input" : "Or paste image path / URL"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              onChange("");
              setUrlInputValue("");
            }}
            disabled={pending}
            className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent-text disabled:opacity-50"
          >
            Remove image
          </button>
        ) : null}
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="/uploads/projects/... or https://example.com/image.jpg"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="w-full min-h-10 border-0 border-b border-line bg-transparent px-0 py-2 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInputValue.trim()) {
                setUploadError(null);
                onChange(urlInputValue.trim());
              }
            }}
            className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-accent-text hover:text-foreground"
          >
            Apply URL
          </button>
        </div>
      ) : null}

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
