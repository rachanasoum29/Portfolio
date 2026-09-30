"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { ensureSiteSettingsRow } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";
import { isValidOptionalHttpUrl } from "@/lib/validation";

export type FooterFormState = {
  formError?: string;
  success?: string;
  fieldErrors?: Partial<
    Record<"facebookUrl" | "instagramUrl" | "telegramUrl" | "footerYear", string>
  >;
};

export async function updateFooter(
  _state: FooterFormState,
  formData: FormData,
): Promise<FooterFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await ensureSiteSettingsRow();

  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim();
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();
  const telegramUrl = String(formData.get("telegramUrl") ?? "").trim();
  const footerYear = String(formData.get("footerYear") ?? "").trim();
  const fieldErrors: FooterFormState["fieldErrors"] = {};

  if (!isValidOptionalHttpUrl(facebookUrl)) {
    fieldErrors.facebookUrl = "Enter a valid http(s) URL.";
  }
  if (!isValidOptionalHttpUrl(instagramUrl)) {
    fieldErrors.instagramUrl = "Enter a valid http(s) URL.";
  }
  if (!isValidOptionalHttpUrl(telegramUrl)) {
    fieldErrors.telegramUrl = "Enter a valid http(s) URL, for example https://t.me/username.";
  }
  if (!footerYear) {
    fieldErrors.footerYear = "Enter a copyright year.";
  } else if (!/^\d{4}$/.test(footerYear)) {
    fieldErrors.footerYear = "Use a 4-digit year, for example 2026.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        facebookUrl,
        instagramUrl,
        telegramUrl,
        footerYear,
      },
    });
  } catch {
    console.error("Update footer failed");
    return { formError: "Could not save footer settings. Try again." };
  }

  revalidatePath("/admin/footer");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/playground");
  revalidatePath("/about");
  revalidatePath("/contact");
  return { success: "Footer saved successfully." };
}
