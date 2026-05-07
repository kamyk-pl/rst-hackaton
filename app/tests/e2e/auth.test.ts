/**
 * E2E tests: authentication & role-based routing
 *
 * Covers all acceptance criteria from issue #2:
 *   - Incorrect credentials show an error
 *   - Patient login → /patient/dashboard
 *   - Doctor login → /doctor/dashboard
 *   - /patient/* as doctor (or unauthenticated) → /login
 *   - /doctor/* as patient (or unauthenticated) → /login
 *   - Logout clears session → /login
 */
import { test, expect } from "@playwright/test";

test.describe("login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows error for incorrect credentials", async ({ page }) => {
    await page.fill('[name="email"]', "patient@medbridge.dev");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('[type="submit"]');

    await expect(page.locator('p[role="alert"]')).toBeVisible();
    await expect(page.locator('p[role="alert"]')).toContainText("Invalid");
    await expect(page).toHaveURL(/\/login/);
  });

  test("patient login redirects to /patient/dashboard", async ({ page }) => {
    await page.fill('[name="email"]', "patient@medbridge.dev");
    await page.fill('[name="password"]', "patient123");
    await page.click('[type="submit"]');

    await expect(page).toHaveURL(/\/patient\/dashboard/);
    // Clear session for isolation
    await page.context().clearCookies();
  });

  test("doctor login redirects to /doctor/dashboard", async ({ page }) => {
    await page.fill('[name="email"]', "doctor@medbridge.dev");
    await page.fill('[name="password"]', "doctor123");
    await page.click('[type="submit"]');

    await expect(page).toHaveURL(/\/doctor\/dashboard/);
    await page.context().clearCookies();
  });
});

test.describe("route protection", () => {
  test("unauthenticated access to /patient/dashboard redirects to login", async ({ page }) => {
    await page.goto("/patient/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated access to /doctor/dashboard redirects to login", async ({ page }) => {
    await page.goto("/doctor/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("patient cannot access /doctor/dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "patient@medbridge.dev");
    await page.fill('[name="password"]', "patient123");
    await page.click('[type="submit"]');
    await expect(page).toHaveURL(/\/patient\/dashboard/);

    await page.goto("/doctor/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await page.context().clearCookies();
  });

  test("doctor cannot access /patient/dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "doctor@medbridge.dev");
    await page.fill('[name="password"]', "doctor123");
    await page.click('[type="submit"]');
    await expect(page).toHaveURL(/\/doctor\/dashboard/);

    await page.goto("/patient/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await page.context().clearCookies();
  });
});

test.describe("logout", () => {
  test("logout clears session and redirects to login", async ({ page }) => {
    // Log in as patient
    await page.goto("/login");
    await page.fill('[name="email"]', "patient@medbridge.dev");
    await page.fill('[name="password"]', "patient123");
    await page.click('[type="submit"]');
    await expect(page).toHaveURL(/\/patient\/dashboard/);

    // Logout
    await page.click('[type="submit"]'); // Logout button
    await expect(page).toHaveURL(/\/login/);

    // Session gone — /patient/dashboard now redirects back to login
    await page.goto("/patient/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
