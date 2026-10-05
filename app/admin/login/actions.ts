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
    const currentDb = (process.env.DATABASE_URL || "").trim();

    if (
      currentDb.includes("127.0.0.1") ||
      currentDb.includes("localhost") ||
      currentDb.includes("USER:PASSWORD")
    ) {
      return {
        formError:
          "DATABASE_URL is set to localhost/placeholder in your Vercel settings. Please update DATABASE_URL in Vercel to your Neon PostgreSQL URL and redeploy.",
      };
    }

    if (
      error instanceof AuthConfigError ||
      (error instanceof Error && error.name === "AuthConfigError") ||
      errorMessage.includes("AUTH_SECRET")
    ) {
      return { formError: "Admin sign-in is not configured. Please check AUTH_SECRET in Vercel." };
    }
    if (
      errorMessage.includes("P1001") ||
      errorMessage.includes("DatabaseNotReachable") ||
      errorMessage.includes("Can't reach database")
    ) {
      const summary = errorMessage.split("\n")[0];
      return {
        formError: `Database connection failed (${summary}). Check your DATABASE_URL in Vercel.`,
      };
    }
    if (errorMessage.includes("P1000") || errorMessage.includes("Authentication failed")) {
      return { formError: "Database credentials failed. Please check your DATABASE_URL in Vercel." };
    }
    return { formError: errorMessage || "Something went wrong. Try again." };
  }

  redirect("/admin");
}
