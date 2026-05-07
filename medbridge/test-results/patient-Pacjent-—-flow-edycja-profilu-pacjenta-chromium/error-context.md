# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: patient.spec.ts >> Pacjent — flow >> edycja profilu pacjenta
- Location: e2e/patient.spec.ts:9:7

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
  2  | import { loginAs, PACJENT } from "./helpers";
  3  | 
  4  | test.describe("Pacjent — flow", () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await loginAs(page, PACJENT);
  7  |   });
  8  | 
  9  |   test("edycja profilu pacjenta", async ({ page }) => {
  10 |     await page.goto("/pacjent/profil/edytuj");
  11 |     await page.fill('input[name="firstName"]', "Anna");
  12 |     await page.fill('input[name="lastName"]', "Testowa");
  13 |     await page.fill('input[name="dateOfBirth"]', "1990-05-15");
  14 |     await page.fill('textarea[name="allergies"]', "Penicylina");
  15 |     await page.click('button[type="submit"]');
> 16 |     await page.waitForURL(/\/pacjent\/profil$/, { timeout: 20000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  17 |     await expect(page.locator("text=Anna Testowa")).toBeVisible();
  18 |   });
  19 | 
  20 |   test("strona profilu pokazuje dane zdrowotne", async ({ page }) => {
  21 |     await page.goto("/pacjent/profil");
  22 |     await page.waitForLoadState("networkidle");
  23 |     await expect(page.locator("text=Dane osobowe")).toBeVisible();
  24 |     await expect(page.locator("text=Informacje medyczne")).toBeVisible();
  25 |   });
  26 | 
  27 |   test("strona dokumentacji jest dostępna", async ({ page }) => {
  28 |     await page.goto("/pacjent/dokumenty");
  29 |     await page.waitForLoadState("networkidle");
  30 |     await expect(page.locator("h1")).toContainText("Dokumentacja medyczna");
  31 |     await expect(page.locator("text=Wgraj dokument")).toBeVisible();
  32 |   });
  33 | 
  34 |   test("strona umawiania wizyt jest dostępna", async ({ page }) => {
  35 |     await page.goto("/pacjent/umow-wizyte");
  36 |     await page.waitForLoadState("networkidle");
  37 |     await expect(page.locator("h1")).toContainText("Umów wizytę");
  38 |   });
  39 | 
  40 |   test("historia wizyt jest dostępna", async ({ page }) => {
  41 |     await page.goto("/pacjent/wizyty");
  42 |     await page.waitForLoadState("networkidle");
  43 |     await expect(page.locator("h1")).toContainText("Historia wizyt");
  44 |   });
  45 | 
  46 |   test("nawigacja sidebar działa poprawnie", async ({ page }) => {
  47 |     await page.goto("/pacjent/profil");
  48 |     await page.click('a:has-text("Dokumentacja")');
  49 |     await expect(page).toHaveURL("/pacjent/dokumenty");
  50 |     await page.click('a:has-text("Historia wizyt")');
  51 |     await expect(page).toHaveURL("/pacjent/wizyty");
  52 |   });
  53 | 
  54 |   test("pacjent nie ma dostępu do stron lekarza — jest przekierowany", async ({ page }) => {
  55 |     await page.goto("/lekarz/wizyty");
  56 |     // Middleware/page redirect do /login, następnie /login → /pacjent/profil (zalogowany)
  57 |     await expect(page).toHaveURL(/\/(pacjent\/|login)/);
  58 |   });
  59 | });
  60 | 
```