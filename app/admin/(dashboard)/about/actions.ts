"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import type { AboutEducation, AboutExperience, AboutSkillGroup } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { ensureAboutRow } from "@/lib/portfolio";
import { isManagedUploadPath } from "@/lib/uploads";
import { isValidOptionalImagePath } from "@/lib/validation";

export type AboutFormState = {
  formError?: string;
  success?: string;
  fieldErrors?: Partial<
    Record<"biography" | "profileImage" | "skills" | "experience" | "education", string>
  >;
};

function parseSkills(raw: string): AboutSkillGroup[] | null {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const groups: AboutSkillGroup[] = [];

  for (const line of lines) {
    const sep = line.indexOf(":");
    if (sep <= 0) return null;
    const label = line.slice(0, sep).trim();
    const skills = line
      .slice(sep + 1)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (!label || skills.length === 0) return null;
    groups.push({ label, skills });
  }

  return groups;
}

function parseExperience(raw: string): AboutExperience[] | null {
  if (!raw.trim()) return [];
  const blocks = raw
    .split(/\n\s*---\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const items: AboutExperience[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 4) return null;
    items.push({
      role: lines[0],
      organization: lines[1],
      period: lines[2],
      summary: lines.slice(3).join(" "),
    });
  }

  return items;
}

function parseEducation(raw: string): AboutEducation[] | null {
  if (!raw.trim()) return [];
  const items: AboutEducation[] = [];
  for (const line of raw
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean)) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 3 || parts.some((part) => !part)) return null;
    items.push({ program: parts[0], institution: parts[1], period: parts[2] });
  }
  return items;
}

export async function updateAbout(
  _state: AboutFormState,
  formData: FormData,
): Promise<AboutFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await ensureAboutRow();

  const biography = String(formData.get("biography") ?? "").trim();
  const profileImage = String(formData.get("profileImage") ?? "").trim();
  const skillsRaw = String(formData.get("skills") ?? "");
  const experienceRaw = String(formData.get("experience") ?? "");
  const educationRaw = String(formData.get("education") ?? "");
  const fieldErrors: AboutFormState["fieldErrors"] = {};

  if (biography.length > 10000) {
    fieldErrors.biography = "Biography must be 10000 characters or fewer.";
  }

  if (
    profileImage &&
    !isManagedUploadPath(profileImage) &&
    !isValidOptionalImagePath(profileImage)
  ) {
    fieldErrors.profileImage = "Upload an image or clear the current one.";
  }

  const skills = parseSkills(skillsRaw);
  if (skills === null) {
    fieldErrors.skills = "Use one group per line: Label: Skill one, Skill two";
  }

  const experience = parseExperience(experienceRaw);
  if (experience === null) {
    fieldErrors.experience =
      "Use blocks of Role, Organization, Period, Summary separated by ---";
  }

  const education = parseEducation(educationRaw);
  if (education === null) {
    fieldErrors.education = "Use one line per entry: Program | Institution | Period";
  }

  if (Object.keys(fieldErrors).length > 0 || !skills || !experience || !education) {
    return { fieldErrors };
  }

  try {
    await prisma.about.update({
      where: { id: "default" },
      data: {
        biography,
        profileImage: profileImage || null,
        skills,
        experience,
        education,
      },
    });
  } catch {
    console.error("Update about failed");
    return { formError: "Could not save About content. Try again." };
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { success: "About saved successfully." };
}
