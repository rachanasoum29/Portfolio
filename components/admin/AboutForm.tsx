"use client";

import { useActionState, useState } from "react";
import { updateAbout, type AboutFormState } from "@/app/admin/(dashboard)/about/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { primaryButtonClass } from "@/components/linkStyles";
import { knownSkillNames } from "@/lib/skill-icons";

const fieldClass =
  "w-full min-h-11 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-muted";

type AboutFormProps = {
  initialValues: {
    profileImage: string;
    biography: string;
    skills: string;
    experience: string;
    education: string;
  };
};

const initialState: AboutFormState = {};

export function AboutForm({ initialValues }: AboutFormProps) {
  const [state, action, pending] = useActionState(updateAbout, initialState);
  const [profileImage, setProfileImage] = useState(initialValues.profileImage);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-7" noValidate>
      <ImageUpload
        name="profileImage"
        label="Profile image"
        folder="about"
        value={profileImage}
        onChange={setProfileImage}
        error={state.fieldErrors?.profileImage}
      />

      <div className="flex flex-col gap-3">
        <label htmlFor="biography" className={labelClass}>
          Biography
        </label>
        <textarea
          id="biography"
          name="biography"
          rows={6}
          defaultValue={initialValues.biography}
          className={`${fieldClass} min-h-40 resize-y`}
        />
        <p className="text-sm text-muted">Separate paragraphs with a blank line.</p>
        {state.fieldErrors?.biography ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.biography}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="skills" className={labelClass}>
          Skills
        </label>
        <textarea
          id="skills"
          name="skills"
          rows={5}
          defaultValue={initialValues.skills}
          className={`${fieldClass} min-h-32 resize-y font-mono text-sm`}
        />
        <p className="text-sm text-muted">
          One group per line, for example: Tech stack: React, Next.js, TypeScript
        </p>
        <p className="text-sm text-muted">Known icons: {knownSkillNames.join(", ")}</p>
        {state.fieldErrors?.skills ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.skills}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="experience" className={labelClass}>
          Experience
        </label>
        <textarea
          id="experience"
          name="experience"
          rows={8}
          defaultValue={initialValues.experience}
          className={`${fieldClass} min-h-40 resize-y font-mono text-sm`}
        />
        <p className="text-sm text-muted">
          Each role is Role, Organization, Period, Summary. Separate roles with ---
        </p>
        {state.fieldErrors?.experience ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.experience}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="education" className={labelClass}>
          Education
        </label>
        <textarea
          id="education"
          name="education"
          rows={4}
          defaultValue={initialValues.education}
          className={`${fieldClass} min-h-28 resize-y font-mono text-sm`}
        />
        <p className="text-sm text-muted">One line per entry: Program | Institution | Period</p>
        {state.fieldErrors?.education ? (
          <p role="alert" className="text-sm text-accent-text">
            {state.fieldErrors.education}
          </p>
        ) : null}
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
        {pending ? "Saving…" : "Save about"}
      </button>
    </form>
  );
}
