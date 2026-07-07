import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TRIBLEERA VAIBHAVAM/);
  });

  test("stats bar renders exactly once (no duplicate)", async ({ page }) => {
    await page.goto("/");
    // Regression test for the duplicate-stats-bar bug: this label previously
    // rendered twice (a mobile block and a desktop block both in the DOM).
    await expect(page.locator("text=Cities across Sri Lanka")).toHaveCount(1);
  });

  test("does not show fabricated 500+ stat", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=500+")).toHaveCount(0);
    await expect(page.locator("text=Couples served")).toHaveCount(0);
  });

  test("shows correct 4 stat values", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=25+").first()).toBeVisible();
    await expect(page.locator("text=4.8").first()).toBeVisible();
    await expect(page.locator("text=20%").first()).toBeVisible();
    await expect(page.locator("text=Cities across Sri Lanka").first()).toBeVisible();
  });

  test("H1 has no double space", async ({ page }) => {
    await page.goto("/");
    const h1 = await page.locator("h1").first().textContent();
    expect(h1?.replace(/\s+/g, " ")).not.toMatch(/ {2,}/);
    expect(h1).toContain("Plan Your");
    expect(h1).toContain("Celebration");
  });

  test("Tamil tagline is visible", async ({ page }) => {
    await page.goto("/");
    // Appears in both Hero and Footer — assert the Hero instance specifically.
    await expect(page.locator("text=தேர்வின் செம்மை").first()).toBeVisible();
  });

  test("hero has 2 CTA buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("a[href='/vendors']").first()).toBeVisible();
    await expect(page.locator("a[href='/event-request']").first()).toBeVisible();
  });

  test("no Vaibhavam Standard placeholder section", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("product thesis visually");
    expect(body).not.toContain("Vaibhavam Standard");
  });

  test("cookie banner appears on first visit and Accept persists", async ({ page }) => {
    await page.goto("/");
    const banner = page.locator("[aria-label='Cookie consent']");
    const acceptBtn = banner.getByRole("button", { name: "Accept" });
    await expect(acceptBtn).toBeVisible({ timeout: 3000 });

    await acceptBtn.click();
    const consent = await page.evaluate(() => localStorage.getItem("TRIBLEERA-cookie-consent"));
    expect(consent).toBe("accepted");

    // Reload — banner must not reappear.
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(acceptBtn).not.toBeVisible();
  });
});
