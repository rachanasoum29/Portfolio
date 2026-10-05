import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL;

  let connectionString = rawUrl?.trim();
  if (
    connectionString &&
    ((connectionString.startsWith('"') && connectionString.endsWith('"')) ||
      (connectionString.startsWith("'") && connectionString.endsWith("'")))
  ) {
    connectionString = connectionString.slice(1, -1).trim();
  }

  if (!connectionString) {
    console.warn(
      "DATABASE_URL is not set. Using fallback mode for static generation. Add your PostgreSQL connection string to your environment variables.",
    );
  }

  const effectiveUrl =
    connectionString ||
    "postgresql://postgres:postgres@localhost:5432/fallback?sslmode=disable";

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: effectiveUrl }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
