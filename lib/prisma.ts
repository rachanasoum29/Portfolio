import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function sanitizeConnectionString(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  let s = rawUrl.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  // Strip channel_binding (incompatible with node-postgres/adapter-pg over connection poolers)
  s = s
    .replace(/&channel_binding=[^&]+/g, "")
    .replace(/\?channel_binding=[^&]+&?/g, "?")
    .replace(/\?$/, "");

  return s;
}

function createPrismaClient() {
  const connectionString = sanitizeConnectionString(process.env.DATABASE_URL);

  if (!connectionString) {
    console.warn(
      "DATABASE_URL is not set. Using fallback mode for static generation. Add your PostgreSQL connection string to your environment variables.",
    );
  }

  const effectiveUrl =
    connectionString ||
    "postgresql://postgres:postgres@localhost:5432/fallback?sslmode=disable";

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: effectiveUrl,
      connectionTimeoutMillis: 25000,
    }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
