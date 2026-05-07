/**
 * E2E smoke test: app serves a response on port 3000
 *
 * RED phase: fails until Next.js app is properly configured.
 * Verifies the hexagonal directory structure and that the app boots.
 */
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const APP_ROOT = path.resolve(__dirname, "../..");

test("hexagonal architecture directories exist", async () => {
  const dirs = ["src/domain", "src/application", "src/infrastructure", "src/presentation"];
  for (const dir of dirs) {
    const fullPath = path.join(APP_ROOT, dir);
    expect(fs.existsSync(fullPath), `Directory missing: ${dir}`).toBe(true);
  }
});

test("app serves a response on the root route", async ({ page }) => {
  await page.goto("/");
  // The app should render something — not a 500 or blank page
  await expect(page).not.toHaveTitle(/error/i);
  const body = await page.locator("body");
  await expect(body).not.toBeEmpty();
});
