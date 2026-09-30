"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { normalizeEmail } from "@/lib/password";
import { ensureSiteSettingsRow } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { isValidOptionalHttpUrl } from "@/lib/validation";

export type SettingsFormState = {
  formError?: string;
  success?: string;
  fieldErrors?: Partial<
    Record<
      "name" | "email" | "githubUrl" | "linkedinUrl" | "cvUrl" | "websiteTitle" | "websiteDescription",
      string
    >
  >;
};

export async function updateSettings(
  _state: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await ensureSiteSettingsRow();

  const name = String(formData.get("name") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const githubUrl = String(formData.get("githubUrl") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
  const cvUrl = String(formData.get("cvUrl") ?? "").trim();
  const websiteTitle = String(formData.get("websiteTitle") ?? "").trim();
  const websiteDescription = String(formData.get("websiteDescription") ?? "").trim();
  const fieldErrors: SettingsFormState["fieldErrors"] = {};

  if (!name) fieldErrors.name = "Enter a name.";
  else if (name.length > 120) fieldErrors.name = "Name must be 120 characters or fewer.";

  const email = emailRaw ? normalizeEmail(emailRaw) : "";
  if (emailRaw && !email) fieldErrors.email = "Enter a valid email.";

  if (!isValidOptionalHttpUrl(githubUrl)) fieldErrors.githubUrl = "Enter a valid http(s) URL.";
  if (!isValidOptionalHttpUrl(linkedinUrl)) fieldErrors.linkedinUrl = "Enter a valid http(s) URL.";
  if (!isValidOptionalHttpUrl(cvUrl)) fieldErrors.cvUrl = "Enter a valid http(s) URL.";

  if (websiteTitle.length > 120) {
    fieldErrors.websiteTitle = "Website title must be 120 characters or fewer.";
  }
  if (websiteDescription.length > 500) {
    fieldErrors.websiteDescription = "Website description must be 500 characters or fewer.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  try {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        name,
        email: email || "",
        githubUrl,
        linkedinUrl,
        cvUrl,
        websiteTitle,
        websiteDescription,
      },
    });
  } catch {
    console.error("Update settings failed");
    return { formError: "Could not save settings. Try again." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: "Settings saved successfully." };
}
