import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactLinks } from "@/components/ContactLinks";
import { Container } from "@/components/Container";
import { popStyle } from "@/components/popStyle";
import { getSiteSettings } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pb-36">
      <header className="max-w-4xl">
        <p
          className="pop text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
          style={popStyle(0)}
        >
          Contact
        </p>
        <h1
          className="pop mt-5 text-[clamp(2.6rem,10vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.045em]"
          style={popStyle(1)}
        >
          Let&apos;s work
          <br />
          together.
        </h1>
        <p className="pop mt-8 max-w-xl text-lg leading-relaxed text-muted" style={popStyle(2)}>
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to build
          something meaningful.
        </p>
      </header>
      <div className="mt-16 grid items-start gap-16 md:mt-20 lg:mt-28 lg:grid-cols-2 lg:gap-20">
        <ContactLinks email={settings.email} />
        <ContactForm />
      </div>
    </Container>
  );
}
