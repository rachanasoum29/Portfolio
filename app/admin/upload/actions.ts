"use server";

import { getCurrentAdmin } from "@/lib/auth";
import { saveUploadedImage, UploadError } from "@/lib/uploads";

export type UploadImageState = {
  url?: string;
  error?: string;
};

export async function uploadImage(formData: FormData): Promise<UploadImageState> {
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

  try {
    const url = await saveUploadedImage(file, folder);
    return { url };
  } catch (error) {
    if (error instanceof UploadError) {
      return { error: error.message };
    }
    console.error("Image upload failed");
    return { error: "Could not upload the image. Try again." };
  }
}
