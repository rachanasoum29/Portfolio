import type { AboutEducation, AboutExperience, AboutSkillGroup } from "@/lib/content";

export function formatSkills(groups: AboutSkillGroup[]) {
  return groups.map((group) => `${group.label}: ${group.skills.join(", ")}`).join("\n");
}

export function formatExperience(items: AboutExperience[]) {
  return items
    .map((item) => `${item.role}\n${item.organization}\n${item.period}\n${item.summary}`)
    .join("\n---\n");
}

export function formatEducation(items: AboutEducation[]) {
  return items.map((item) => `${item.program} | ${item.institution} | ${item.period}`).join("\n");
}
