import { ArrowLink } from "@/components/ArrowLink";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <Container className="py-12 md:py-16 lg:py-20">
        <div>
          <p
            className="enter text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
            style={{ animationDelay: "40ms" }}
          >
            Hello, I&apos;m
          </p>
          <h1
            className="enter mt-6 max-w-full text-[clamp(2.25rem,8vw,8.25rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em] [overflow-wrap:anywhere] sm:mt-8"
            style={{ animationDelay: "120ms" }}
          >
            {site.name}
          </h1>
          <p
            className="enter mt-8 text-[11px] font-medium uppercase tracking-[0.22em] text-muted md:mt-12"
            style={{ animationDelay: "200ms" }}
          >
            {site.role}
          </p>
          <p
            className="enter mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            style={{ animationDelay: "280ms" }}
          >
            {site.intro}
          </p>
          <div
            className="enter mt-10 flex flex-wrap gap-x-10 gap-y-4"
            style={{ animationDelay: "360ms" }}
          >
            <ArrowLink href="/work">View my work</ArrowLink>
            <ArrowLink href="/about">About me</ArrowLink>
          </div>
          <a
            href="#selected-work"
            className="enter mt-8 inline-flex min-h-11 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-muted transition-colors duration-200 hover:text-accent-text"
            style={{ animationDelay: "440ms" }}
          >
            Scroll
            <span aria-hidden="true" className="nudge inline-block">
              ↓
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
