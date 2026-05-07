import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  // Use commonjs tsconfig so Playwright can import Prisma-generated CJS modules
  tsconfig: "./tsconfig.test.json",

  projects: [
    // Integration tests — no browser, no server needed
    {
      name: "integration",
      testDir: "./tests/integration",
      use: {},
    },
    // E2E smoke tests — require a running Next.js dev server
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
      },
    },
  ],

  // webServer is scoped here but only consumed by the e2e project
  // Use --webpack to avoid Turbopack root-detection issues in monorepo layouts
  webServer: {
    command: "next dev --webpack",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  use: {
    trace: "on-first-retry",
  },
});
