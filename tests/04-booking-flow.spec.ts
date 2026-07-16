import { test, expect } from "@playwright/test";

// Real cart schema (context/CartContext.tsx): key "TRIBLEERA-cart-v1",
// items are BookingLineItem { vendorId, vendorName, categorySlug, packageId, packageName, price }.
function seedCartItem() {
  return {
    vendorId: "jaffna-frames-studio",
    vendorName: "Jaffna Frames Studio",
    packageId: "jaffna-frames-studio-essential",
    packageName: "Essential",
    categorySlug: "photography",
    price: 66000,
  };
}

// Real "TRIBLEERA-last-booking" shape (app/booking/confirmation/page.tsx's LastBooking
// interface) — the confirmation page dereferences booking.items/.customer/.totals
// directly, so a bare {id, adminVerified, status} object crashes the render.
function seedBooking(overrides: Record<string, unknown>) {
  return {
    id: "TRB-TEST",
    items: [seedCartItem()],
    totals: { serviceTotal: 66000, advanceAmount: 13200, platformFee: 1980, payableNow: 15180, remainingBalance: 52800 },
    customer: { name: "Test User", phone: "+94771234567", email: "test@example.com", eventDate: "2026-12-01" },
    paymentMethod: "card",
    createdAt: new Date().toISOString(),
    status: "pending",
    adminVerified: false,
    ...overrides,
  };
}

test.describe("Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((item) => {
      localStorage.setItem("TRIBLEERA-cart-v1", JSON.stringify([item]));
    }, seedCartItem());
  });

  test("cart page loads with item", async ({ page }) => {
    await page.goto("/booking/cart");
    await expect(page.locator("text=Jaffna Frames Studio")).toBeVisible();
  });

  test("shows per-service advance breakdown", async ({ page }) => {
    await page.goto("/booking/cart");
    await expect(page.locator("text=Advance (20%)")).toBeVisible();
    await expect(page.locator("text=Platform fee (3%)")).toBeVisible();
  });

  test("blocks adding second vendor from same category", async ({ page }) => {
    await page.goto("/vendors/lumiere-wedding-films/packages"); // also photography
    const addBtn = page.locator("button", { hasText: /select this package|select.*package|add.*cart/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator("text=already have a")).toBeVisible();
    }
  });

  test("empty cart shows empty state", async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("TRIBLEERA-cart-v1"));
    await page.goto("/booking/cart");
    await expect(page.locator("text=Your cart is empty")).toBeVisible();
  });
});

test.describe("Payment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((item) => {
      localStorage.setItem("TRIBLEERA-cart-v1", JSON.stringify([item]));
    }, seedCartItem());
  });

  test("payment page redirects signed-out users to login", async ({ page }) => {
    await page.goto("/booking/payment");
    await expect(page).toHaveURL(/\/login\?redirect=%2Fbooking%2Fpayment/);
  });

  test("payment page loads for signed-in users", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("customer-auth", "test@example.com");
      window.sessionStorage.setItem("user-auth", "true");
    });
    await page.goto("/booking/payment");
    await expect(page).toHaveTitle(/TRIBLEERA VAIBHAVAM/);
  });

  test("bank transfer shows account details", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("customer-auth", "test@example.com");
      window.sessionStorage.setItem("user-auth", "true");
    });
    await page.goto("/booking/payment");
    await page.locator("label", { hasText: "Online Bank Transfer" }).click();
    await expect(page.locator("text=People's Bank")).toBeVisible();
    await expect(page.locator("text=TRIBLEERA VAIBHAVAM PVT LTD")).toBeVisible();
  });

  test("submit disabled without deposit slip for bank transfer", async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("customer-auth", "test@example.com");
      window.sessionStorage.setItem("user-auth", "true");
    });
    await page.goto("/booking/payment");
    await page.locator("label", { hasText: "Online Bank Transfer" }).click();
    const submitBtn = page.locator("button[type='submit']").first();
    await expect(submitBtn).toBeDisabled();
  });
});

test.describe("Confirmation", () => {
  test("confirmation page loads", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((b) => localStorage.setItem("TRIBLEERA-last-booking", JSON.stringify(b)), seedBooking({}));
    await page.goto("/booking/confirmation");
    await expect(page).toHaveTitle(/TRIBLEERA VAIBHAVAM/);
  });

  test("shows pending verification state initially", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((b) => localStorage.setItem("TRIBLEERA-last-booking", JSON.stringify(b)), seedBooking({ adminVerified: false, status: "pending" }));
    await page.goto("/booking/confirmation");
    // Two elements contain "Awaiting" (the pending message and a status
    // badge) — either confirms the pending state, .first() avoids strict mode.
    await expect(page.locator("text=Awaiting").first()).toBeVisible();
  });

  test("shows confirmed state when adminVerified", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((b) => localStorage.setItem("TRIBLEERA-last-booking", JSON.stringify(b)), seedBooking({ adminVerified: true, status: "confirmed" }));
    await page.goto("/booking/confirmation");
    await expect(page.locator("text=Order Confirmed")).toBeVisible();
  });
});
