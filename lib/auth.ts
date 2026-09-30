import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  createSessionToken,
  passwordFingerprint,
  readSessionToken,
  sessionCookieOptions,
} from "@/lib/session";

let dummyHash: Promise<string> | undefined;

function unusedPasswordHash() {
  dummyHash ??= hashPassword("unused-admin-password");
  return dummyHash;
}

export async function authenticate(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!admin) {
    await verifyPassword(password, await unusedPasswordHash());
    return null;
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return null;
  }

  return admin;
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!admin || passwordFingerprint(admin.passwordHash) !== session.pwd) {
    return null;
  }

  return { id: admin.id, email: admin.email };
}

export async function setSession(adminId: string, passwordHash: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(adminId, passwordHash), sessionCookieOptions());
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
}
