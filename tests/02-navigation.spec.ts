import { test, expect } from "@playwright/test";

const PAGES = ["/", "/vendors", "/vendors/jaffna-frames-studio", "/services", "/trust"];

for (const url of PAGES) {
  test.describe(`Nav on ${url}`, () => {
    test("shows 4 nav links", async ({ page }, testInfo) => {
      // Header's desktop <nav> is `hidden md:flex` — at the Mobile Safari
      // viewport the same links only exist inside the closed hamburger Sheet,
      // which "mobile hamburger opens Sheet" already covers separately.
      testInfo.skip(testInfo.project.name === "Mobile Safari", "desktop-only nav bar");
      await page.goto(url);
      await expect(page.locator("nav a", { hasText: "Services" }).first()).toBeVisible();
      await expect(page.locator("nav a", { hasText: "Vendors" }).first()).toBeVisible();
      await expect(page.locator("nav a", { hasText: "How it works" }).first()).toBeVisible();
      await expect(page.locator("nav a", { hasText: "Plan Your Wedding" }).first()).toBeVisible();
    });

    test("no raw /shortlist or /booking/cart text in header", async ({ page }) => {
      await page.goto(url);
      const navText = await page.locator("header").textContent();
      expect(navText).not.toContain("/shortlist");
      expect(navText).not.toContain("/booking/cart");
    });

    test("Sign In links to /login", async ({ page }) => {
      await page.goto(url);
      const signIn = page.locator("a", { hasText: /sign in/i }).first();
      await expect(signIn).toHaveAttribute("href", "/login");
    });

    test("footer shows correct-case TRIBLEERA VAIBHAVAM copyright", async ({ page }) => {
      await page.goto(url);
      const footer = await page.locator("footer").textContent();
      expect(footer).toContain("TRIBLEERA VAIBHAVAM");
      expect(footer).not.toContain("Tribleera Vaibhavam");
    });

    test("footer Tamil tagline present", async ({ page }) => {
      await page.goto(url);
      const footer = await page.locator("footer").textContent();
      expect(footer).toContain("தேர்வின் செம்மை");
    });

    test("footer has exactly one Terms link", async ({ page }) => {
      await page.goto(url);
      const legalLinks = page.locator("footer").locator("a", { hasText: "Terms" });
      await expect(legalLinks).toHaveCount(1);
    });
  });
}

test("logo navigates to homepage", async ({ page }) => {
  await page.goto("/vendors");
  await page.locator("header a[href='/']").first().click();
  await expect(page).toHaveURL("/");
});

test("mobile hamburger opens Sheet", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.locator("[aria-label='Open menu']").click();
  // The cookie-consent banner also has role="dialog" — scope to the Sheet
  // specifically (its Radix Dialog title is "Menu").
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(menu.locator("text=Services")).toBeVisible();
});
