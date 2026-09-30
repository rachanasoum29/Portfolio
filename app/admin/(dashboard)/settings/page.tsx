import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ensureSiteSettingsRow } from "@/lib/portfolio";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await ensureSiteSettingsRow();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Site</p>
        <p className="mt-2 max-w-xl text-muted">
          Update site identity, contact links, and website metadata.
        </p>
      </div>
      <SettingsForm
        initialValues={{
          name: settings.name,
          email: settings.email,
          githubUrl: settings.githubUrl,
          linkedinUrl: settings.linkedinUrl,
          cvUrl: settings.cvUrl,
          websiteTitle: settings.websiteTitle,
          websiteDescription: settings.websiteDescription,
        }}
      />
    </div>
  );
}
