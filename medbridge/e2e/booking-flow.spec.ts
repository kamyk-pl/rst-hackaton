import { test, expect, Page } from "@playwright/test";
import { loginAs, PACJENT, LEKARZ } from "./helpers";

async function addSlot(page: Page) {
  await loginAs(page, LEKARZ);
  await page.goto("/lekarz/terminy");
  const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const dateStr = future.toISOString().split("T")[0];
  await page.fill('input[name="date"]', dateStr);
  await page.fill('input[name="time"]', "14:00");
  await page.click('button:has-text("Dodaj termin")');
  await expect(page.locator("text=Dostępny").first()).toBeVisible();
  await page.click('button:has-text("Wyloguj się")');
  await page.waitForURL("/login");
}

test.describe("Pełny flow rezerwacji (DoD)", () => {
  test("lekarz dodaje slot → pacjent rezerwuje → lekarz dodaje podsumowanie → pacjent widzi podsumowanie", async ({ page }) => {
    // 1. Lekarz dodaje slot
    await addSlot(page);

    // 2. Pacjent rezerwuje wizytę
    await loginAs(page, PACJENT);
    await page.goto("/pacjent/umow-wizyte");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=dr Jan Nowak")).toBeVisible();
    await page.click("text=dr Jan Nowak");
    await page.waitForURL(/umow-wizyte\/.+/);
    await page.waitForLoadState("networkidle");

    const slotButton = page.locator("button").filter({ hasText: /14:00/ }).first();
    await slotButton.click();

    await page.check('input[name="consent"]');
    await page.click('button:has-text("Potwierdź rezerwację")');
    await page.waitForURL("/pacjent/wizyty");
    await expect(page.locator("text=Zaplanowana").first()).toBeVisible();

    await page.click('button:has-text("Wyloguj się")');
    await page.waitForURL("/login");

    // 3. Lekarz widzi wizytę i dodaje podsumowanie
    await loginAs(page, LEKARZ);
    await page.goto("/lekarz/wizyty");
    await page.waitForLoadState("networkidle");

    const visitLink = page.locator('a[href*="/lekarz/wizyty/"]').first();
    await visitLink.click();
    await page.waitForURL(/lekarz\/wizyty\/[^/]+$/);
    await page.waitForLoadState("networkidle");

    await page.click("text=Dodaj podsumowanie wizyty");
    await page.waitForURL(/podsumowanie/);

    await page.fill('textarea[name="diagnosis"]', "Nadciśnienie tętnicze I stopnia");
    await page.fill('textarea[name="recommendations"]', "Dieta niskosodowa");
    await page.fill('textarea[name="prescribedMedications"]', "Amlodypina 5mg");
    await page.click('button:has-text("Zapisz podsumowanie")');
    await page.waitForURL("/lekarz/wizyty");

    await page.click('button:has-text("Wyloguj się")');
    await page.waitForURL("/login");

    // 4. Pacjent widzi podsumowanie
    await loginAs(page, PACJENT);
    await page.goto("/pacjent/wizyty");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Zakończona").first()).toBeVisible();

    const detailLink = page.locator('a[href*="/pacjent/wizyty/"]').first();
    await detailLink.click();
    await page.waitForURL(/pacjent\/wizyty\/.+/);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=Nadciśnienie tętnicze I stopnia")).toBeVisible();
    await expect(page.locator("text=Dieta niskosodowa")).toBeVisible();
  });
});
