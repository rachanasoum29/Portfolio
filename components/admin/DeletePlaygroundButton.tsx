"use client";

import { deletePlaygroundItem } from "@/app/admin/(dashboard)/playground/actions";

export function DeletePlaygroundButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePlaygroundItem}
      onSubmit={(event) => {
        if (!window.confirm(`Are you sure you want to delete this playground item?\n\n${title}`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted hover:text-accent-text"
      >
        Delete
      </button>
    </form>
  );
}
