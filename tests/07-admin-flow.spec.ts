import { test, expect } from "@playwright/test";

test.describe("Admin Login", () => {
  test("admin dashboard redirects to login without auth", async ({ page }) => {
    await page.goto("/dashboard/admin");
    await expect(page).toHaveURL(/admin\/login/);
  });

  test("wrong credentials show error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input#username").fill("admin");
    await page.locator("input#password").fill("wrongpassword");
    await page.locator("button[type='submit']").click();
    await expect(page.locator("text=Invalid username")).toBeVisible();
  });

  test("correct credentials access dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input#username").fill("admin");
    // Real hardcoded credential (app/admin/login/page.tsx) is uppercase.
    await page.locator("input#password").fill("TRIBLEERA2026");
    await page.locator("button[type='submit']").click();
    await expect(page).toHaveURL("/dashboard/admin");
  });
});

test.describe("Admin Sidebar", () => {
  // sessionStorage is origin-scoped — must land on the site before setting it.
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.evaluate(() => sessionStorage.setItem("admin-auth", "true"));
  });

  test("sidebar shows all nav items", async ({ page }, testInfo) => {
    // app/dashboard/admin/layout.tsx: <aside> is `hidden md:flex` — desktop only.
    testInfo.skip(testInfo.project.name === "Mobile Safari", "desktop sidebar only");
    await page.goto("/dashboard/admin");
    for (const label of ["Dashboard", "Vendors", "Bookings", "Payments", "Disputes", "Reports"]) {
      await expect(page.locator("aside").locator(`text=${label}`)).toBeVisible();
    }
  });

  test("vendors page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/vendors");
    await expect(page).toHaveTitle(/Vendor/);
  });

  test("reminders page loads", async ({ page }) => {
    await page.goto("/dashboard/admin/reminders");
    await expect(page).toHaveTitle(/Reminders/);
  });

  test("logout clears session", async ({ page }, testInfo) => {
    // Sign out lives in the same desktop-only <aside>.
    testInfo.skip(testInfo.project.name === "Mobile Safari", "desktop sidebar only");
    await page.goto("/dashboard/admin");
    await page.locator("button", { hasText: /sign out/i }).click();
    await expect(page).toHaveURL(/admin\/login/);
    const auth = await page.evaluate(() => sessionStorage.getItem("admin-auth"));
    expect(auth).toBeNull();
  });
});
