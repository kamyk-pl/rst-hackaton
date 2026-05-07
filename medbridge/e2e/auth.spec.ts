import { test, expect } from "@playwright/test";
import { PACJENT, LEKARZ } from "./helpers";

test.describe("Autentykacja", () => {
  test("niezalogowany jest przekierowany na /login", async ({ page }) => {
    await page.goto("/pacjent/profil");
    await expect(page).toHaveURL("/login");
  });

  test("błędne dane logowania pokazują komunikat błędu", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "zly@email.pl");
    await page.fill('input[name="password"]', "zlehaslo");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Nieprawidłowy email lub hasło")).toBeVisible();
  });

  test("pacjent loguje się i trafia na swój dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', PACJENT.email);
    await page.fill('input[name="password"]', PACJENT.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/pacjent/profil");
    await expect(page.locator("text=MedBridge").first()).toBeVisible();
  });

  test("lekarz loguje się i trafia na swój dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', LEKARZ.email);
    await page.fill('input[name="password"]', LEKARZ.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/lekarz/wizyty");
  });

  test("zalogowany pacjent trafia po zalogowaniu na swój dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', PACJENT.email);
    await page.fill('input[name="password"]', PACJENT.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/pacjent/profil");
    // Po zalogowaniu jesteśmy na dashboardzie
    await expect(page).toHaveURL("/pacjent/profil");
  });

  test("wylogowanie przekierowuje na /login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', PACJENT.email);
    await page.fill('input[name="password"]', PACJENT.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/pacjent/profil");
    await page.click('button:has-text("Wyloguj się")');
    await expect(page).toHaveURL("/login");
  });
});
