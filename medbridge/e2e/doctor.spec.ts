import { test, expect } from "@playwright/test";
import { loginAs, LEKARZ } from "./helpers";

test.describe("Lekarz — flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, LEKARZ);
  });

  test("edycja profilu lekarza", async ({ page }) => {
    await page.goto("/lekarz/profil/edytuj");
    await page.fill('input[name="firstName"]', "Jan");
    await page.fill('input[name="lastName"]', "Nowak");
    await page.fill('input[name="specialization"]', "Kardiolog");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/lekarz\/profil$/, { timeout: 20000 });
    await expect(page.locator("text=Jan Nowak")).toBeVisible();
  });

  test("dodanie nowego slotu", async ({ page }) => {
    await page.goto("/lekarz/terminy");
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dateStr = future.toISOString().split("T")[0];
    await page.fill('input[name="date"]', dateStr);
    await page.fill('input[name="time"]', "10:00");
    await page.click('button:has-text("Dodaj termin")');
    await expect(page.locator("text=Dostępny").first()).toBeVisible();
  });

  test("harmonogram wizyt jest dostępny", async ({ page }) => {
    await page.goto("/lekarz/wizyty");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Harmonogram wizyt");
  });

  test("nawigacja sidebar działa poprawnie", async ({ page }) => {
    await page.goto("/lekarz/wizyty");
    await page.click('a:has-text("Moje terminy")');
    await expect(page).toHaveURL("/lekarz/terminy");
    await page.click('a:has-text("Harmonogram wizyt")');
    await expect(page).toHaveURL("/lekarz/wizyty");
  });

  test("lekarz nie ma dostępu do stron pacjenta — jest przekierowany", async ({ page }) => {
    await page.goto("/pacjent/profil");
    await expect(page).toHaveURL(/\/(lekarz\/|login)/);
  });
});
