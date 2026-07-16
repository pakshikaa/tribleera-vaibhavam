import { test, expect } from "@playwright/test";

test.describe("Edge Cases & 404", () => {
  test("non-existent vendor returns 404", async ({ page }) => {
    const response = await page.goto("/vendors/non-existent-vendor-xyz");
    expect(response?.status()).toBe(404);
  });

  test("404 page has a way back home", async ({ page }) => {
    await page.goto("/vendors/non-existent-vendor-xyz");
    await expect(page.locator("a[href='/']").first()).toBeVisible();
  });

  test("invalid booking track id returns 404", async ({ page }) => {
    const response = await page.goto("/booking/track/INVALID-ID-123");
    expect(response?.status()).toBe(404);
  });

  test("empty cart: signed-out payment route redirects to login", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-cart-v1"));
    await page.goto("/booking/payment");
    await expect(page).toHaveURL(/\/login\?redirect=%2Fbooking%2Fpayment/);
  });

  test("empty cart: signed-in payment page shows an empty-cart state rather than the form", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("customer-auth", "test@example.com");
      window.sessionStorage.setItem("user-auth", "true");
    });
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-cart-v1"));
    await page.goto("/booking/payment");
    await expect(page.locator("text=Nothing to pay for yet")).toBeVisible();
  });

  test("shortlist empty state", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-shortlist-v1"));
    await page.goto("/shortlist");
    await expect(page.locator("text=No vendors saved yet")).toBeVisible();
    await expect(page.locator("a[href='/vendors']:visible").first()).toBeVisible();
  });
});
