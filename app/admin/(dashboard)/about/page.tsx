import type { Metadata } from "next";
import { AboutForm } from "@/components/admin/AboutForm";
import type { AboutEducation, AboutExperience, AboutSkillGroup } from "@/lib/content";
import {
  formatEducation,
  formatExperience,
  formatSkills,
} from "@/lib/about-format";
import { ensureAboutRow } from "@/lib/portfolio";

export const metadata: Metadata = { title: "About" };

function asSkillGroups(value: unknown): AboutSkillGroup[] {
  return Array.isArray(value) ? (value as AboutSkillGroup[]) : [];
}

function asExperience(value: unknown): AboutExperience[] {
  return Array.isArray(value) ? (value as AboutExperience[]) : [];
}

function asEducation(value: unknown): AboutEducation[] {
  return Array.isArray(value) ? (value as AboutEducation[]) : [];
}

export default async function AdminAboutPage() {
  const about = await ensureAboutRow();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Profile</p>
        <p className="mt-2 max-w-xl text-muted">
          Update the biography, skills, experience, and education shown on the About page.
        </p>
      </div>
      <AboutForm
        initialValues={{
          profileImage: about.profileImage ?? "",
          biography: about.biography,
          skills: formatSkills(asSkillGroups(about.skills)),
          experience: formatExperience(asExperience(about.experience)),
          education: formatEducation(asEducation(about.education)),
        }}
      />
    </div>
  );
}
