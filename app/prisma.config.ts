import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

// Absolute fallback so `npx prisma migrate dev` works on a fresh clone
// without a .env file (which is gitignored).
const defaultDbUrl = `file:${path.resolve(__dirname, "prisma/dev.db")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? defaultDbUrl,
  },
});
