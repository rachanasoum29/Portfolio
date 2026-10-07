import { DeviceStage } from "@/components/DeviceStage";
import { PlaceholderLink } from "@/components/PlaceholderLink";
import { popOnScroll } from "@/components/popStyle";
import type { PortfolioProject } from "@/lib/portfolio";

const titleClass =
  "max-w-[11em] text-[clamp(2.1rem,4.6vw,4.25rem)] font-medium uppercase leading-[0.9] tracking-[-0.035em]";

export function ProjectCard({
  project,
  layout = "stacked",
  index = 0,
}: {
  project: PortfolioProject;
  layout?: "split" | "stacked";
  index?: number;
}) {
  const tech = project.technologies.join(" · ");
  const stage = (
    <DeviceStage
      laptopImage={project.laptopImage || project.image}
      mobileImage={project.mobileImage}
      src={project.image}
      title={project.title}
      year={project.year || undefined}
      href={`/work#${project.slug}`}
    />
  );

  if (layout === "split") {
    return (
      <article
        className="pop pop-view group border-b border-line py-6 last:border-b-0 md:py-8 lg:py-10"
        style={popOnScroll(index)}
      >
        {stage}
      </article>
    );
  }

  return (
    <article id={project.slug} className="pop pop-view group border-b border-line py-16 last:border-b-0 md:py-24" style={popOnScroll(index)}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <p className="font-mono text-sm text-accent-text lg:col-span-2">{project.number}</p>
        <h2 className={`${titleClass} lg:col-span-10`}>{project.title}</h2>
      </div>
      <div className="mt-8 md:mt-10">{stage}</div>
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:mt-10 lg:gap-12">
        <p className="font-mono text-[13px] leading-relaxed break-words text-muted lg:col-span-6">{tech}</p>
        <div className="lg:col-span-6">
          <p className="max-w-prose leading-relaxed text-muted">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            <PlaceholderLink label="GitHub" />
            <PlaceholderLink label="Live" />
          </div>
        </div>
      </div>
    </article>
  );
}
