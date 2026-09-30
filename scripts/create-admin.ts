import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizeEmail } from "@/lib/password";

async function main() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? "");
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email) {
    console.error("Set ADMIN_EMAIL to a valid email address, then run this command again.");
    process.exitCode = 1;
    return;
  }

  if (password.length < 12 || password.length > 128) {
    console.error("Set ADMIN_PASSWORD to 12–128 characters, then run this command again.");
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(password);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin account saved for ${email}.`);
}

main()
  .catch(() => {
    console.error("Could not save the admin account.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
