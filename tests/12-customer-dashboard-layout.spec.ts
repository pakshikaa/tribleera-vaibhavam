import { test, expect } from "@playwright/test";

test.describe("Customer dashboard layout", () => {
  test("hides public marketing header on customer dashboard routes", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("customer-auth", "true");
      window.sessionStorage.setItem("customer-name", "Pavi");
    });

    await page.goto("/dashboard/customer");

    await expect(page.getByText("Customer Space")).toHaveCount(1);
    await expect(page.locator("header a", { hasText: "Services" })).toHaveCount(0);
    await expect(page.locator("header a", { hasText: "Plan Your Wedding" })).toHaveCount(0);
  });
});
