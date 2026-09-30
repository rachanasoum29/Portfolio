import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="content" className="min-w-0 flex-1 pt-14">
        {children}
      </main>
      <Footer />
    </>
  );
}
