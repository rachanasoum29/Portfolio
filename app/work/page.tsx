import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { DeviceStage } from "@/components/DeviceStage";
import { SectionHeading } from "@/components/SectionHeading";
import { popOnScroll } from "@/components/popStyle";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "A visual archive of web projects.",
};

export default function WorkPage() {
  return (
    <Container className="pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="pop pop-view" style={popOnScroll(0)}>
        <SectionHeading
          label="Index"
          title="Work"
          titleAs="h1"
          intro="A visual archive of projects. Screenshots will replace these placeholder images."
        />
      </div>
      <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12">
        {projects.map((project, index) => (
          <article id={project.slug} key={project.slug} className="pop pop-view" style={popOnScroll(index + 1)}>
            <DeviceStage
              src={project.image}
              title={project.title}
              year={project.year}
              href={`/work#${project.slug}`}
              number={project.number}
              tech={project.technologies.join(" · ")}
              summary={project.description}
            />
          </article>
        ))}
      </div>
    </Container>
  );
}
