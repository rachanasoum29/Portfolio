import type { Metadata } from "next";
import { FooterForm } from "@/components/admin/FooterForm";
import { ensureSiteSettingsRow } from "@/lib/portfolio";

export const metadata: Metadata = { title: "Footer" };

export default async function AdminFooterPage() {
  const settings = await ensureSiteSettingsRow();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Site</p>
        <p className="mt-2 max-w-xl text-muted">
          Update footer social links and the copyright year shown on the public site.
        </p>
      </div>
      <FooterForm
        initialValues={{
          facebookUrl: settings.facebookUrl,
          instagramUrl: settings.instagramUrl,
          telegramUrl: settings.telegramUrl,
          footerYear: settings.footerYear,
          email: settings.email,
          name: settings.name,
        }}
      />
    </div>
  );
}
