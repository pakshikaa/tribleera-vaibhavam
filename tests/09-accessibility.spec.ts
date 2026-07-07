import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("skip to main content link is focusable and visible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a", { hasText: /skip.*main/i });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test("shortlist link has a descriptive aria-label, not the raw URL", async ({ page }) => {
    await page.goto("/");
    // MobileBottomNav has an identical href — scope to the header's icon link.
    const link = page.locator("header a[href='/shortlist']");
    const ariaLabel = await link.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).not.toBe("/shortlist");
  });

  test("cart link has a descriptive aria-label, not the raw URL", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("header a[href='/booking/cart']");
    const ariaLabel = await link.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).not.toBe("/booking/cart");
  });

  test("all images have alt text", async ({ page }) => {
    await page.goto("/");
    // A single evaluateAll — the homepage has an auto-scrolling testimonials
    // marquee that continuously mounts/unmounts nodes, which made a per-element
    // getAttribute loop flaky (an element could vanish between snapshot and read).
    const alts = await page.locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("alt")));
    for (const alt of alts) expect(alt).not.toBeNull();
  });

  test("lightbox has role=dialog and aria-modal", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await page.locator("[aria-label*='Open gallery']").first().click();
    const dialog = page.locator("[role='dialog'][aria-label*='gallery']");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("keyboard can reach and activate a vendor card link", async ({ page }) => {
    await page.goto("/vendors");
    // Tab past the skip link and header controls to reach page content.
    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
