import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#admin-content" className="skip-link">
        Skip to content
      </a>
      <div id="admin-content" className="min-h-screen flex-1">
        {children}
      </div>
    </>
  );
}
