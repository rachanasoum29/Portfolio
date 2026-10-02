"use server";

import { getCurrentAdmin } from "@/lib/auth";
import { saveUploadedImage, UploadError } from "@/lib/uploads";

export type UploadImageState = {
  url?: string;
  error?: string;
};

export async function uploadImage(formData: FormData): Promise<UploadImageState> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { error: "You must be signed in to upload images." };
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Choose an image to upload." };
    }

    const folderRaw = String(formData.get("folder") ?? "projects");
    const folder = ["projects", "playground", "about"].includes(folderRaw)
      ? folderRaw
      : "projects";

    const url = await saveUploadedImage(file, folder);
    return { url };
  } catch (error) {
    console.error("Image upload server action failed:", error);
    if (error instanceof UploadError) {
      return { error: error.message };
    }
    
    // Check for common connection/network/Vercel issues
    const errorMessage = error instanceof Error ? error.message : "";
    if (errorMessage.includes("P1001") || errorMessage.includes("DatabaseNotReachable")) {
      return { error: "Database connection failed. Please try again." };
    }
    if (errorMessage.includes("payload too large") || errorMessage.includes("413")) {
      return { error: "Image file size is too large (max 4.5MB on Vercel)." };
    }
    
    return { error: "Could not upload the image. Please try again." };
  }
}
