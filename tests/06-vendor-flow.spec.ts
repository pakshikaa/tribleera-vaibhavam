import { test, expect } from "@playwright/test";

test.describe("Vendor Register", () => {
  test("loads 4-step form", async ({ page }) => {
    await page.goto("/vendor/register");
    await expect(page).toHaveTitle(/TRIBLEERA VAIBHAVAM/);
    await expect(page.locator("input[name='businessName']")).toBeVisible();
  });

  test("step 1 validation: empty required fields block progress", async ({ page }) => {
    await page.goto("/vendor/register");
    await page.locator("button", { hasText: /continue/i }).click();
    const errors = page.locator("[role='alert']");
    expect(await errors.count()).toBeGreaterThan(0);
  });
});

test.describe("Vendor Login", () => {
  test("wrong password shows error", async ({ page }) => {
    await page.goto("/vendor/login");
    await page.locator("input[type='tel']").first().fill("+94771000001");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.locator("button[type='submit']").click();
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("correct password redirects to dashboard", async ({ page }) => {
    await page.goto("/vendor/login");
    await page.evaluate(() => {
      const vendors = [{ slug: "test-studio", phone: "+94771000001", password: "vendor2026", profileComplete: true }];
      localStorage.setItem("TRIBLEERA-approved-vendors", JSON.stringify(vendors));
    });
    await page.locator("input[type='tel']").first().fill("+94771000001");
    await page.locator("input[type='password']").fill("vendor2026");
    await page.locator("button[type='submit']").click();
    await expect(page).toHaveURL(/dashboard\/vendor/);
  });
});
