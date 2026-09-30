import { Container } from "@/components/Container";
import { getSiteSettings } from "@/lib/portfolio";

const quietLinkClass =
  "group inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent-text";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <p className="text-2xl font-medium tracking-[-0.03em]">{settings.name}</p>
        <ul className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <li>
            <FooterLink href={settings.facebookUrl || null} label="Facebook" />
          </li>
          <li>
            <FooterLink href={settings.instagramUrl || null} label="Instagram" />
          </li>
        </ul>
        <p className="text-sm text-muted">
          © {settings.year} {settings.name}
        </p>
      </Container>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return (
      <span className={`${quietLinkClass} cursor-default opacity-60`}>
        {label}
        <span aria-hidden="true" className="arrow-shift">
          ↗
        </span>
      </span>
    );
  }

  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className={quietLinkClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
      <span aria-hidden="true" className="arrow-shift">
        ↗
      </span>
    </a>
  );
}
