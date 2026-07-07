import { test, expect } from "@playwright/test";

test.describe("Vendor Listing", () => {
  test("shows vendors on /vendors", async ({ page }) => {
    await page.goto("/vendors");
    const cards = page.locator("a[href^='/vendors/']");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/vendors");
    // Category quick-pills render as <a> (Button-as-Link), not <button>.
    await page.locator("a", { hasText: "Photography" }).first().click();
    await expect(page).toHaveURL(/category=photography/);
  });

  test("city filter updates URL", async ({ page }) => {
    await page.goto("/vendors");
    await page.locator("select[aria-label='Filter by city']").selectOption("Jaffna");
    await expect(page).toHaveURL(/city=Jaffna/);
  });

  test("no vendor-comparison Compare feature on listing page", async ({ page }) => {
    await page.goto("/vendors");
    await expect(page.locator("text=Compare")).toHaveCount(0);
  });

  test("heart button shortlists vendor", async ({ page }) => {
    await page.goto("/vendors");
    // Scope to <main> — Header's own "Your shortlist" link also matches
    // [aria-label*='shortlist'] and would otherwise win .first() and navigate away.
    const heart = page.locator("main [aria-label*='shortlist']").first();
    await heart.click();
    await expect(page.locator("a[aria-label='Your shortlist'] span", { hasText: "1" })).toBeVisible();
  });
});

test.describe("Vendor Profile", () => {
  test("loads Jaffna Frames Studio", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await expect(page.locator("h1")).toContainText("Jaffna Frames Studio");
  });

  test("breadcrumb shows correct path", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toContainText("Vendors");
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toContainText("Photography");
  });

  test("gallery opens lightbox on click", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await page.locator("[aria-label*='Open gallery']").first().click();
    await expect(page.locator("[role='dialog'][aria-label*='gallery']")).toBeVisible();
  });

  test("lightbox closes on Escape", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await page.locator("[aria-label*='Open gallery']").first().click();
    await page.keyboard.press("Escape");
    await expect(page.locator("[role='dialog'][aria-label*='gallery']")).not.toBeVisible();
  });

  test("contact section is locked for an unauthenticated visitor", async ({ page }, testInfo) => {
    // The sidebar holding VendorContactClient is `hidden md:block` — on
    // mobile the equivalent surface is VendorMobileBookBar, a different
    // component not covered by this assertion.
    testInfo.skip(testInfo.project.name === "Mobile Safari", "desktop sidebar only");
    await page.goto("/vendors/jaffna-frames-studio");
    await expect(page.locator("text=Contact revealed after booking")).toBeVisible();
    await expect(page.locator("text=+94 77")).toHaveCount(0);
  });

  test("shows 3 packages", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    const packages = page.locator("button", { hasText: "Select this package" });
    await expect(packages).toHaveCount(3);
  });

  test("similar vendors section shows", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    await expect(page.locator("text=Similar studios")).toBeVisible();
  });

  test("back button exists and works", async ({ page }) => {
    await page.goto("/vendors/jaffna-frames-studio");
    // ':visible' — Header's desktop nav "Vendors" link matches the same text
    // but is CSS-hidden on the Mobile Safari viewport.
    await page.locator("a:visible", { hasText: /vendors/i }).first().click();
    await expect(page).toHaveURL(/\/vendors/);
  });
});
