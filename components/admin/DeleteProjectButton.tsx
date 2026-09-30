"use client";

import { deleteProject } from "@/app/admin/(dashboard)/work/actions";

type DeleteProjectButtonProps = {
  id: string;
  title: string;
};

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Are you sure you want to delete this project?\n\n${title}`,
        );
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent-text"
      >
        Delete
      </button>
    </form>
  );
}
