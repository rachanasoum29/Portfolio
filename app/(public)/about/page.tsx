import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillMark } from "@/components/SkillMark";
import { popStyle } from "@/components/popStyle";
import { about as fallbackAbout, skillGroups as fallbackSkillGroups } from "@/data/about";
import { getAboutContent } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: "About a junior web developer.",
};

const labelClass = "text-[11px] font-medium uppercase tracking-[0.22em] text-accent-text";

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default async function AboutPage() {
  const content = await getAboutContent();
  const paragraphs =
    content && content.paragraphs.length > 0
      ? content.paragraphs
      : [...fallbackAbout.paragraphs];
  const skillGroups =
    content && content.skillGroups.length > 0 ? content.skillGroups : fallbackSkillGroups;
  const experience =
    content && content.experience.length > 0
      ? content.experience
      : [...fallbackAbout.experience];
  const education =
    content && content.education.length > 0
      ? content.education
      : [...fallbackAbout.education];

  return (
    <Container className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pb-36">
      <div className="pop" style={popStyle(0)}>
        <SectionHeading label="Profile" title="About me" titleAs="h1" />
      </div>
      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-start lg:gap-16">
        {content?.profileImage ? (
          <div className="pop md:col-span-4" style={popStyle(1)}>
            <div className="relative aspect-square max-w-xs overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <Image
                src={content.profileImage}
                alt="Profile picture"
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(min-width: 768px) 320px, 100vw"
              />
            </div>
          </div>
        ) : null}
        <section
          aria-labelledby="about-copy"
          className={content?.profileImage ? "md:col-span-8" : "max-w-3xl"}
        >
          <h2 id="about-copy" className="sr-only">
            About
          </h2>
          <div className="space-y-6 text-xl leading-relaxed md:text-2xl">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 24)}`}
                className="pop"
                style={popStyle(index + (content?.profileImage ? 2 : 1))}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>
      <section aria-labelledby="skills-heading" className="mt-16 flex flex-col gap-10 md:mt-24 md:gap-12">
        <h2 id="skills-heading" className="sr-only">
          Skills
        </h2>
        {skillGroups.map((group, groupIndex) => (
          <div key={group.label} className="grid items-center gap-5 md:grid-cols-[11rem_1fr] md:gap-10">
            <h3 className="pop text-lg font-medium text-accent md:text-xl" style={popStyle(groupIndex + 1)}>
              {group.label}
            </h3>
            <ul className="skill-row flex flex-wrap items-center gap-x-4 gap-y-3">
              {group.skills.map((skill, index) => (
                <li key={skill.name}>
                  <SkillMark icon={skill.icon} name={skill.name} index={index} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section aria-labelledby="experience-heading" className="mt-16 md:mt-24">
        <h2 id="experience-heading" className={`pop ${labelClass}`} style={popStyle(0)}>
          Experience
        </h2>
        <div className="mt-6 border-t border-line">
          {experience.map((item, index) => (
            <article
              key={`${item.role}-${item.organization}-${index}`}
              className="pop grid gap-2 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-10"
              style={popStyle(index + 1)}
            >
              <p className="font-mono text-sm text-accent-text md:col-span-1">{indexLabel(index)}</p>
              <div className="md:col-span-6">
                <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{item.role}</h3>
                <p className="mt-3 max-w-prose leading-relaxed text-muted">{item.summary}</p>
              </div>
              <p className="text-muted md:col-span-3 md:text-right">{item.organization}</p>
              <p className="font-mono text-sm text-muted md:col-span-2 md:text-right">{item.period}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="education-heading" className="mt-16 md:mt-24">
        <h2 id="education-heading" className={`pop ${labelClass}`} style={popStyle(0)}>
          Education
        </h2>
        <div className="mt-6 border-t border-line">
          {education.map((item, index) => (
            <article
              key={`${item.program}-${item.institution}-${index}`}
              className="pop grid gap-2 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-10"
              style={popStyle(index + 1)}
            >
              <p className="font-mono text-sm text-accent-text md:col-span-1">{indexLabel(index)}</p>
              <h3 className="text-2xl font-medium tracking-[-0.03em] md:col-span-6 md:text-3xl">
                {item.program}
              </h3>
              <p className="text-muted md:col-span-3 md:text-right">{item.institution}</p>
              <p className="font-mono text-sm text-muted md:col-span-2 md:text-right">{item.period}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
