import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test.describe("Mobile 375px", () => {
  test("homepage: no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("mobile bottom nav has 5 tabs", async ({ page }) => {
    await page.goto("/");
    // components/layout/MobileBottomNav.tsx: fixed inset-x-0 bottom-0, md:hidden
    const tabs = page.locator("nav.fixed.inset-x-0.bottom-0 a");
    expect(await tabs.count()).toBe(5);
  });

  test("vendor listing: no horizontal scroll", async ({ page }) => {
    await page.goto("/vendors");
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("vendor profile: no horizontal scroll", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("desktop sidebar hidden on mobile (vendor dashboard)", async ({ page }) => {
    await page.goto("/vendor/login");
    await page.evaluate(() => sessionStorage.setItem("vendor-auth", "true"));
    await page.goto("/dashboard/vendor");
    await expect(page.locator("aside")).toBeHidden();
  });

  test("header icon buttons meet 44px touch target (desktop viewport)", async ({ page }) => {
    // Header's icon cluster is `hidden md:flex` — only rendered at desktop widths.
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    const links = page.locator("header a[aria-label='Your shortlist'], header a[aria-label='Your cart']");
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
    }
  });
});
