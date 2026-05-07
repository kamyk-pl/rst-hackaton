/**
 * Infrastructure adapter: Prisma client factory.
 *
 * Prisma v7 requires a driver adapter. This module provides a singleton for
 * the application and a factory for tests (which need isolated databases).
 */
import path from "path";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Absolute path so it resolves correctly regardless of process.cwd()
export const DEV_DB_URL = `file:${path.resolve(__dirname, "../../..", "prisma/dev.db")}`;

export function createPrismaClient(dbUrl: string): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
}

// Application singleton — reads DATABASE_URL from env
const dbUrl = process.env.DATABASE_URL ?? DEV_DB_URL;

// Singleton for dev/prod (avoid multiple connections in Next.js HMR)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrismaClient(dbUrl);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
