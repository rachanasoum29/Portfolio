import { prisma } from "@/lib/prisma";
import type {
  AboutEducation,
  AboutExperience,
  AboutSkillGroup,
} from "@/lib/content";
import { site as fallbackSite } from "@/data/site";
import { projects as fallbackProjectsList } from "@/data/projects";
import { experiments as fallbackPlaygroundList } from "@/data/playground";
import { about as fallbackAbout, skillGroups as fallbackSkillGroups } from "@/data/about";
import { skillIconMap } from "@/lib/skill-icons";
import { slugify } from "@/lib/validation";
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
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });

    if (rows.length === 0) {
      return fallbackProjectsList.map((p) => ({
        id: p.slug,
        number: p.number,
        slug: p.slug,
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        image: p.image,
        year: p.year,
      }));
    }

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
  } catch (error) {
    console.warn("Could not query database for published projects, using fallback:", error);
    return fallbackProjectsList.map((p) => ({
      id: p.slug,
      number: p.number,
      slug: p.slug,
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      image: p.image,
      year: p.year,
    }));
  }
}

export async function getSelectedProjects(limit = 3): Promise<PortfolioProject[]> {
  const projects = await getPublishedProjects();
  return projects.slice(0, limit);
}

function getFallbackPlayground(): PortfolioExperiment[] {
  return fallbackPlaygroundList.map((item, index) => ({
    number: item.number || indexLabel(index),
    slug: slugify(item.title) || `experiment-${index + 1}`,
    title: item.title,
    description: item.description,
    technology: item.technology,
    image: item.image,
  }));
}

export async function getPublishedPlayground(): Promise<PortfolioExperiment[]> {
  try {
    const rows = await prisma.playgroundItem.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    });

    if (rows.length === 0) {
      return getFallbackPlayground();
    }

    return rows.map((row, index) => ({
      number: indexLabel(index),
      slug: row.slug,
      title: row.title,
      description: row.description,
      technology: row.technology,
      image: row.image || "/images/play-01.svg",
    }));
  } catch (error) {
    console.warn("Could not query database for playground items, using fallback:", error);
    return getFallbackPlayground();
  }
}

export async function getAboutContent() {
  try {
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
  } catch (error) {
    console.warn("Could not query database for about content, using fallback:", error);
    return {
      profileImage: null,
      paragraphs: [...fallbackAbout.paragraphs],
      skillGroups: fallbackSkillGroups,
      experience: [...fallbackAbout.experience],
      education: [...fallbackAbout.education],
    };
  }
}

export async function getSiteSettings() {
  try {
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
  } catch (error) {
    console.warn("Could not query database for site settings, using fallback:", error);
    return {
      name: fallbackSite.name,
      email: fallbackSite.email,
      githubUrl: "",
      linkedinUrl: fallbackSite.linkedin,
      cvUrl: "",
      websiteTitle: fallbackSite.name,
      websiteDescription: fallbackSite.intro,
      facebookUrl: "",
      instagramUrl: "",
      footerYear: fallbackSite.year,
      role: fallbackSite.role,
      year: fallbackSite.year,
      intro: fallbackSite.intro,
    };
  }
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
