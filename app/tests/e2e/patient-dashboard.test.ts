/**
 * E2E tests: patient dashboard — profile display
 *
 * Regression test for the "use server" import boundary bug in ProfileForm.
 * Verifies that after a successful patient login the dashboard actually renders
 * its profile content, not a blank page or error overlay.
 */
import { test, expect } from "@playwright/test";

test.describe("patient dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "patient@medbridge.dev");
    await page.fill('[name="password"]', "patient123");
    await page.click('[type="submit"]');
    await expect(page).toHaveURL(/\/patient\/dashboard/);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("renders Patient Dashboard heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Patient Dashboard");
  });

  test("renders Personal Information section with patient name fields", async ({ page }) => {
    await expect(page.getByText("Personal Information")).toBeVisible();
    await expect(page.locator('[name="firstName"]')).toBeVisible();
    await expect(page.locator('[name="lastName"]')).toBeVisible();
    await expect(page.locator('[name="dateOfBirth"]')).toBeVisible();
  });

  test("renders Allergies section", async ({ page }) => {
    await expect(page.getByText("Allergies")).toBeVisible();
  });

  test("renders Chronic Diseases section", async ({ page }) => {
    await expect(page.getByText("Chronic Diseases")).toBeVisible();
  });

  test("renders Permanent Medications section", async ({ page }) => {
    await expect(page.getByText("Permanent Medications")).toBeVisible();
  });

  test("pre-fills patient name from seeded data", async ({ page }) => {
    const firstName = await page.locator('[name="firstName"]').inputValue();
    const lastName = await page.locator('[name="lastName"]').inputValue();
    expect(firstName.length).toBeGreaterThan(0);
    expect(lastName.length).toBeGreaterThan(0);
  });
});
