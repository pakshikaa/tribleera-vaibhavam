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

  test("empty cart: payment page shows an empty-cart state rather than the form", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-cart-v1"));
    await page.goto("/booking/payment");
    // app/booking/payment/page.tsx renders an EmptyState in-place for an empty
    // cart rather than redirecting — assert the correct real behavior.
    await expect(page.locator("text=Nothing to pay for yet")).toBeVisible();
  });

  test("shortlist empty state", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-shortlist-v1"));
    await page.goto("/shortlist");
    await expect(page.locator("text=No vendors saved yet")).toBeVisible();
    await expect(page.locator("a[href='/vendors']").first()).toBeVisible();
  });
});
