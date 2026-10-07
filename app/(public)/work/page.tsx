import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DeviceStage } from "@/components/DeviceStage";
import { SectionHeading } from "@/components/SectionHeading";
import { popOnScroll } from "@/components/popStyle";
import { getPublishedProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "A visual archive of web projects.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <Container className="pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="pop pop-view" style={popOnScroll(0)}>
        <SectionHeading
          label="Index"
          title="Work"
          titleAs="h1"
          intro="A visual archive of projects."
        />
      </div>
      <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12">
        {projects.length === 0 ? (
          <p className="text-muted">No published projects yet.</p>
        ) : (
          projects.map((project, index) => (
            <article
              id={project.slug}
              key={project.slug}
              className="pop pop-view"
              style={popOnScroll(index + 1)}
            >
              <DeviceStage
                laptopImage={project.laptopImage || project.image}
                mobileImage={project.mobileImage}
                src={project.image}
                title={project.title}
                year={project.year || undefined}
                href={`/work#${project.slug}`}
                number={project.number}
                tech={project.technologies.join(" · ")}
                summary={project.description}
              />
            </article>
          ))
        )}
      </div>
    </Container>
  );
}
