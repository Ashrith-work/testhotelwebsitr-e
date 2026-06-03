import { PrismaClient } from "@prisma/client";

// PrismaClient singleton. Next.js dev mode hot-reloads modules, which would
// otherwise spawn a new client (and a new connection pool) on every reload and
// exhaust connections. We cache it on globalThis in non-production.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
