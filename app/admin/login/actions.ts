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

    const errorMessage = error instanceof Error ? error.message : String(error ?? "");
    const currentDb = process.env.DATABASE_URL ?? "";

    const lines = errorMessage
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const summary =
      lines.find(
        (l) =>
          !l.startsWith("Invalid `") &&
          !l.startsWith("-->") &&
          !l.startsWith("at ") &&
          l.length > 5,
      ) ||
      lines[0] ||
      "Unable to connect to database";

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

    if (currentDb && !currentDb.includes("@")) {
      return {
        formError:
          "DATABASE_URL is missing the '@' symbol between password and host (e.g. postgresql://user:password@host...). Please check your DATABASE_URL in Vercel.",
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
      errorMessage.includes("Can't reach database") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      return {
        formError: `Database connection failed (${summary}). Make sure your Neon compute is active (not suspended/idle) and DATABASE_URL in Vercel is correct.`,
      };
    }

    if (
      errorMessage.includes("P1000") ||
      errorMessage.includes("Authentication failed") ||
      errorMessage.includes("password authentication failed")
    ) {
      return {
        formError:
          "Database password incorrect. Click 'Show password' in Neon to verify the password in your DATABASE_URL in Vercel.",
      };
    }

    return { formError: summary || "Something went wrong. Try again." };
  }

  redirect("/admin");
}