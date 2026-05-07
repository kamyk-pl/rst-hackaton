import { Page, BrowserContext } from "@playwright/test";

export const PACJENT = { email: "pacjent@test.pl", password: "haslo123" };
export const LEKARZ = { email: "lekarz@test.pl", password: "haslo123" };

export async function loginAs(page: Page, user: { email: string; password: string }) {
  // Clear cookies so previous session doesn't interfere
  await page.context().clearCookies();

  await page.goto("/login", { waitUntil: "domcontentloaded" });

  // If already redirected away from login (session still valid), handle it
  if (!page.url().includes("/login")) {
    await page.context().clearCookies();
    await page.goto("/login", { waitUntil: "domcontentloaded" });
  }

  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(pacjent|lekarz)\//, { timeout: 15000 });
}

export async function logout(page: Page) {
  await page.click('button:has-text("Wyloguj się")');
  await page.waitForURL("/login", { timeout: 10000 });
}
