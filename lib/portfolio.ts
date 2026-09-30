import { prisma } from "@/lib/prisma";
import type {
  AboutEducation,
  AboutExperience,
  AboutSkillGroup,
} from "@/lib/content";
import { site as fallbackSite } from "@/data/site";
import { skillIconMap } from "@/lib/skill-icons";
import type { SimpleIcon } from "simple-icons";

export type PortfolioProject = {
  id: string;
  number: string;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  year: string;
};

export type PortfolioExperiment = {
  number: string;
  slug: string;
  title: string;
  description: string;
  technology: string;
  image: string;
};

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

function asSkillGroups(value: unknown): AboutSkillGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is AboutSkillGroup =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AboutSkillGroup).label === "string" &&
      Array.isArray((item as AboutSkillGroup).skills),
  );
}

function asExperience(value: unknown): AboutExperience[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is AboutExperience =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AboutExperience).role === "string",
  );
}

function asEducation(value: unknown): AboutEducation[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is AboutEducation =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as AboutEducation).program === "string",
  );
}

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return rows.map((row, index) => ({
    id: row.id,
    number: indexLabel(index),
    slug: row.slug,
    title: row.title,
    description: row.description,
    technologies: row.technologies,
    image: row.image || "/images/project-01.svg",
    year: row.year,
  }));
}

export async function getSelectedProjects(limit = 3): Promise<PortfolioProject[]> {
  const projects = await getPublishedProjects();
  return projects.slice(0, limit);
}

export async function getPublishedPlayground(): Promise<PortfolioExperiment[]> {
  const rows = await prisma.playgroundItem.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return rows.map((row, index) => ({
    number: indexLabel(index),
    slug: row.slug,
    title: row.title,
    description: row.description,
    technology: row.technology,
    image: row.image || "/images/play-01.svg",
  }));
}

export async function getAboutContent() {
  const row = await prisma.about.findUnique({ where: { id: "default" } });
  if (!row) {
    return null;
  }

  const biography = row.biography.trim();
  const paragraphs = biography
    ? biography.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    : [];

  const skillGroups = asSkillGroups(row.skills).map((group) => ({
    label: group.label,
    skills: group.skills
      .map((name) => {
        const icon = skillIconMap[name.toLowerCase()];
        return icon ? { name, icon } : null;
      })
      .filter((skill): skill is { name: string; icon: SimpleIcon } => skill !== null),
  })).filter((group) => group.skills.length > 0);

  return {
    profileImage: row.profileImage,
    paragraphs,
    skillGroups,
    experience: asExperience(row.experience),
    education: asEducation(row.education),
  };
}

export async function getSiteSettings() {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return {
    name: row?.name || fallbackSite.name,
    email: row?.email || fallbackSite.email,
    githubUrl: row?.githubUrl || "",
    linkedinUrl: row?.linkedinUrl || fallbackSite.linkedin,
    cvUrl: row?.cvUrl || "",
    websiteTitle: row?.websiteTitle || fallbackSite.name,
    websiteDescription: row?.websiteDescription || fallbackSite.intro,
    facebookUrl: row?.facebookUrl || "",
    instagramUrl: row?.instagramUrl || "",
    footerYear: row?.footerYear || fallbackSite.year,
    role: fallbackSite.role,
    year: row?.footerYear || fallbackSite.year,
    intro: row?.websiteDescription || fallbackSite.intro,
  };
}

export async function ensureAboutRow() {
  return prisma.about.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}

export async function ensureSiteSettingsRow() {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: fallbackSite.name,
      email: fallbackSite.email,
      websiteTitle: fallbackSite.name,
      websiteDescription: fallbackSite.intro,
      linkedinUrl: fallbackSite.linkedin.startsWith("[") ? "" : fallbackSite.linkedin,
    },
  });
}
