import { test, expect } from "@playwright/test";
import { loginAs, PACJENT } from "./helpers";

test.describe("Pacjent — flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, PACJENT);
  });

  test("edycja profilu pacjenta", async ({ page }) => {
    await page.goto("/pacjent/profil/edytuj");
    await page.fill('input[name="firstName"]', "Anna");
    await page.fill('input[name="lastName"]', "Testowa");
    await page.fill('input[name="dateOfBirth"]', "1990-05-15");
    await page.fill('textarea[name="allergies"]', "Penicylina");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/pacjent\/profil$/, { timeout: 20000 });
    await expect(page.locator("text=Anna Testowa")).toBeVisible();
  });

  test("strona profilu pokazuje dane zdrowotne", async ({ page }) => {
    await page.goto("/pacjent/profil");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Dane osobowe")).toBeVisible();
    await expect(page.locator("text=Informacje medyczne")).toBeVisible();
  });

  test("strona dokumentacji jest dostępna", async ({ page }) => {
    await page.goto("/pacjent/dokumenty");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Dokumentacja medyczna");
    await expect(page.locator("text=Wgraj dokument")).toBeVisible();
  });

  test("strona umawiania wizyt jest dostępna", async ({ page }) => {
    await page.goto("/pacjent/umow-wizyte");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Umów wizytę");
  });

  test("historia wizyt jest dostępna", async ({ page }) => {
    await page.goto("/pacjent/wizyty");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Historia wizyt");
  });

  test("nawigacja sidebar działa poprawnie", async ({ page }) => {
    await page.goto("/pacjent/profil");
    await page.click('a:has-text("Dokumentacja")');
    await expect(page).toHaveURL("/pacjent/dokumenty");
    await page.click('a:has-text("Historia wizyt")');
    await expect(page).toHaveURL("/pacjent/wizyty");
  });

  test("pacjent nie ma dostępu do stron lekarza — jest przekierowany", async ({ page }) => {
    await page.goto("/lekarz/wizyty");
    // Middleware/page redirect do /login, następnie /login → /pacjent/profil (zalogowany)
    await expect(page).toHaveURL(/\/(pacjent\/|login)/);
  });
});
