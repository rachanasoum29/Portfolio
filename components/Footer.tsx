import { Container } from "@/components/Container";
import { PlaceholderLink } from "@/components/PlaceholderLink";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <p className="text-2xl font-medium tracking-[-0.03em]">{site.name}</p>
        <ul className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <li>
            <PlaceholderLink label="Facebook" variant="quiet" />
          </li>
          <li>
            <PlaceholderLink label="Instagram" variant="quiet" />
          </li>
          <li>
            <PlaceholderLink label="Email" variant="quiet" />
          </li>
        </ul>
        <p className="text-sm text-muted">
          © {site.year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
