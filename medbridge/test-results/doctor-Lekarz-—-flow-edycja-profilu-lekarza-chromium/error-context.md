# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: doctor.spec.ts >> Lekarz — flow >> edycja profilu lekarza
- Location: e2e/doctor.spec.ts:9:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:3001/login"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e6]
        - generic [ref=e8]: MedBridge
      - generic [ref=e9]:
        - heading "Twoja historia medyczna zawsze pod ręką." [level=2] [ref=e10]:
          - text: Twoja historia
          - text: medyczna zawsze
          - text: pod ręką.
        - paragraph [ref=e11]: Centralne zarządzanie dokumentacją medyczną i wizytami lekarskimi dla pacjentów i lekarzy.
      - generic [ref=e12]: Hackathon 2026 · Prototyp
    - generic [ref=e14]:
      - link "Powrót" [ref=e15] [cursor=pointer]:
        - /url: /
        - img [ref=e16]
        - text: Powrót
      - heading "Zaloguj się" [level=1] [ref=e18]
      - paragraph [ref=e19]: "Konta testowe: pacjent@test.pl / lekarz@test.pl"
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]: Email
          - textbox "Email" [ref=e23]:
            - /placeholder: adres@email.pl
        - generic [ref=e24]:
          - generic [ref=e25]: Hasło
          - textbox "Hasło" [ref=e26]:
            - /placeholder: ••••••••
        - button "Zaloguj się" [ref=e27]
      - paragraph [ref=e28]: "Hasło do obu kont: haslo123"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { loginAs, LEKARZ } from "./helpers";
  3  | 
  4  | test.describe("Lekarz — flow", () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await loginAs(page, LEKARZ);
  7  |   });
  8  | 
  9  |   test("edycja profilu lekarza", async ({ page }) => {
  10 |     await page.goto("/lekarz/profil/edytuj");
  11 |     await page.fill('input[name="firstName"]', "Jan");
  12 |     await page.fill('input[name="lastName"]', "Nowak");
  13 |     await page.fill('input[name="specialization"]', "Kardiolog");
  14 |     await page.click('button[type="submit"]');
> 15 |     await page.waitForURL(/\/lekarz\/profil$/, { timeout: 20000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  16 |     await expect(page.locator("text=Jan Nowak")).toBeVisible();
  17 |   });
  18 | 
  19 |   test("dodanie nowego slotu", async ({ page }) => {
  20 |     await page.goto("/lekarz/terminy");
  21 |     const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  22 |     const dateStr = future.toISOString().split("T")[0];
  23 |     await page.fill('input[name="date"]', dateStr);
  24 |     await page.fill('input[name="time"]', "10:00");
  25 |     await page.click('button:has-text("Dodaj termin")');
  26 |     await expect(page.locator("text=Dostępny").first()).toBeVisible();
  27 |   });
  28 | 
  29 |   test("harmonogram wizyt jest dostępny", async ({ page }) => {
  30 |     await page.goto("/lekarz/wizyty");
  31 |     await page.waitForLoadState("networkidle");
  32 |     await expect(page.locator("h1")).toContainText("Harmonogram wizyt");
  33 |   });
  34 | 
  35 |   test("nawigacja sidebar działa poprawnie", async ({ page }) => {
  36 |     await page.goto("/lekarz/wizyty");
  37 |     await page.click('a:has-text("Moje terminy")');
  38 |     await expect(page).toHaveURL("/lekarz/terminy");
  39 |     await page.click('a:has-text("Harmonogram wizyt")');
  40 |     await expect(page).toHaveURL("/lekarz/wizyty");
  41 |   });
  42 | 
  43 |   test("lekarz nie ma dostępu do stron pacjenta — jest przekierowany", async ({ page }) => {
  44 |     await page.goto("/pacjent/profil");
  45 |     await expect(page).toHaveURL(/\/(lekarz\/|login)/);
  46 |   });
  47 | });
  48 | 
```