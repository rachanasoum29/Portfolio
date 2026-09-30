import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";

export default function HomePage() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <Hero />
      <section id="selected-work" aria-labelledby="selected-work-heading" className="border-t border-line">
        <Container className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-36">
          <SectionHeading
            id="selected-work-heading"
            
            title="Selected work"
            size="label"
          />
          {/* <p className="mt-6 max-w-xl leading-relaxed text-muted">
            Three projects from the archive. Images are placeholders until screenshots are added.
          </p> */}
          <div className="mt-8 md:mt-12">
            {featured.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                layout="split"
                reverse={index % 2 === 1}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
