"use server";

import { redirect } from "next/navigation";
import { authenticate, setSession } from "@/lib/auth";
import { normalizeEmail } from "@/lib/password";
import { AuthConfigError } from "@/lib/session";

export type LoginState = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const emailValue = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fieldErrors: LoginState["fieldErrors"] = {};

  if (!emailValue.trim()) {
    fieldErrors.email = "Enter your email.";
  } else if (!normalizeEmail(emailValue)) {
    fieldErrors.email = "Enter a valid email.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  } else if (password.length > 128) {
    return { formError: "Invalid email or password." };
  }

  if (fieldErrors.email || fieldErrors.password) {
    return { fieldErrors };
  }

  const email = normalizeEmail(emailValue);
  if (!email) {
    return { fieldErrors: { email: "Enter a valid email." } };
  }

  try {
    const admin = await authenticate(email, password);
    if (!admin) {
      return { formError: "Invalid email or password." };
    }
    await setSession(admin.id, admin.passwordHash);
  } catch (error) {
    console.error("Admin login failed:", error);
    const errorMessage = error instanceof Error ? error.message : "";
    if (
      error instanceof AuthConfigError ||
      (error instanceof Error && error.name === "AuthConfigError") ||
      errorMessage.includes("AUTH_SECRET")
    ) {
      return { formError: "Admin sign-in is not configured. Please check AUTH_SECRET." };
    }
    if (errorMessage.includes("P1001") || errorMessage.includes("DatabaseNotReachable") || errorMessage.includes("Can't reach database")) {
      return { formError: "Database connection failed. Please check your DATABASE_URL in Vercel." };
    }
    if (errorMessage.includes("P1000") || errorMessage.includes("Authentication failed")) {
      return { formError: "Database credentials failed. Please check your DATABASE_URL in Vercel." };
    }
    return { formError: errorMessage || "Something went wrong. Try again." };
  }

  redirect("/admin");
}
