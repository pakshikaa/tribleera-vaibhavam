import { test, expect, Page } from "@playwright/test";

async function fillStep1(page: Page) {
  const futureDate = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
  await page.locator("input[type='date']").fill(futureDate);
  await page.locator("select").first().selectOption("Jaffna");
  await page.locator("input[type='number']").fill("150");
  await page.locator("button", { hasText: "LKR 50K-150K" }).click();
  await page.locator("button", { hasText: /continue/i }).click();
}

test.describe("Event Request Form", () => {
  test("loads step 1", async ({ page }) => {
    await page.goto("/event-request");
    await expect(page.locator("text=Your Celebration")).toBeVisible();
  });

  test("past date shows validation error", async ({ page }) => {
    await page.goto("/event-request");
    await page.locator("input[type='date']").fill("2020-01-01");
    await page.locator("button", { hasText: /continue/i }).click();
    await expect(page.locator("text=future date")).toBeVisible();
  });

  test("can advance to step 2 with valid data", async ({ page }) => {
    await page.goto("/event-request");
    await fillStep1(page);
    await expect(page.locator("text=Select Services")).toBeVisible();
  });

  test("step 2: selecting no service blocks progress", async ({ page }) => {
    await page.goto("/event-request");
    await fillStep1(page);
    await page.locator("button", { hasText: /continue/i }).click();
    // Still on step 2 — zod requires selectedServices.min(1)
    await expect(page.locator("text=Select Services")).toBeVisible();
    await expect(page.locator("text=Select at least one service")).toBeVisible();
  });

  test("step 3: image upload and voice recording controls visible", async ({ page }) => {
    await page.goto("/event-request");
    await fillStep1(page);
    // Step 2 — select one category card (renders as a labelled button per category)
    await page.locator("button", { hasText: "Photography" }).first().click();
    await page.locator("button", { hasText: /continue/i }).click();
    await expect(page.locator("text=Your Priorities")).toBeVisible();

    await expect(page.locator("input[type='file'][accept*='image']")).toBeAttached();
    await expect(page.locator("button[aria-label='Start voice recording']")).toBeVisible();
  });
});
