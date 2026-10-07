import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getSelectedProjects, getSiteSettings } from "@/lib/portfolio";

export default async function HomePage() {
  const [featured, settings] = await Promise.all([
    getSelectedProjects(3),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageLoader minDuration={1500} />
      <Hero name={settings.name} role={settings.role} intro={settings.intro} />
      <section id="selected-work" aria-labelledby="selected-work-heading" className="border-t border-line">
        <Container className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-36">
          <SectionHeading id="selected-work-heading" title="Selected work" size="label" />
          <div className="mt-4">
            {featured.length === 0 ? (
              <p className="text-muted">Published projects will appear here.</p>
            ) : (
              featured.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  layout="split"
                  index={index}
                />
              ))
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
