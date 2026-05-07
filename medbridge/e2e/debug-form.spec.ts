import { test } from "@playwright/test";
import { loginAs, LEKARZ } from "./helpers";

test("debug: trace form submission", async ({ page, context }) => {
  await loginAs(page, LEKARZ);
  await page.goto("/lekarz/profil/edytuj");
  await page.waitForLoadState("networkidle");
  await page.fill('input[name="firstName"]', "Jan");
  await page.fill('input[name="lastName"]', "Nowak");
  await page.fill('input[name="specialization"]', "Kardiolog");
  
  const allResponses: string[] = [];
  page.on("response", (res) => {
    const url = res.url().replace("http://localhost:3001", "");
    if (!url.includes("_next/static")) {
      allResponses.push(`${res.status()} ${url}`);
    }
  });
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      allResponses.push(`NAV: ${frame.url().replace("http://localhost:3001", "")}`);
    }
  });
  
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);
  
  console.log("All responses and navigations:");
  allResponses.forEach(r => console.log(" ", r));
  
  const cookies = await context.cookies();
  console.log("Remaining cookies:", cookies.map(c => c.name).join(", ") || "NONE");
});
