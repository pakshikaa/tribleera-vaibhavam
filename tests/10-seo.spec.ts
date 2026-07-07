import { test, expect } from "@playwright/test";

const PAGES_SEO = [
  { url: "/", titleContains: "Plan Your Perfect Celebration" },
  { url: "/vendors", titleContains: "Browse Vendors" },
  { url: "/services", titleContains: "Services" },
  { url: "/trust", titleContains: "TRIBLEERA" },
  { url: "/about", titleContains: "About" },
  { url: "/faq", titleContains: "FAQ" },
  { url: "/contact", titleContains: "Contact" },
];

for (const { url, titleContains } of PAGES_SEO) {
  test(`${url} has correct title`, async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveTitle(new RegExp(titleContains));
  });

  test(`${url} title is not malformed/doubled`, async ({ page }) => {
    await page.goto(url);
    const title = await page.title();
    // A title should mention the brand once, not "X | TRIBLEERA VAIBHAVAM | TRIBLEERA VAIBHAVAM".
    const occurrences = title.split("TRIBLEERA VAIBHAVAM").length - 1;
    expect(occurrences).toBeLessThanOrEqual(1);
  });

  test(`${url} has meta description`, async ({ page }) => {
    await page.goto(url);
    const meta = await page.locator("meta[name='description']").getAttribute("content");
    expect(meta).toBeTruthy();
    expect(meta!.length).toBeGreaterThan(30);
    expect(meta!.length).toBeLessThan(200);
  });

  test(`${url} canonical/OG url is not example.com`, async ({ page }) => {
    await page.goto(url);
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href").catch(() => null);
    if (canonical) {
      expect(canonical).not.toContain("example.com");
    }
  });
}

test("homepage has exactly one H1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
});

test("sitemap.xml is accessible and does not point at example.com", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).not.toContain("example.com");
  expect(body).toContain("tribleera-vaibhavam.vercel.app");
});

test("robots.txt is accessible and points its sitemap at the real domain", async ({ page }) => {
  const response = await page.request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).not.toContain("example.com");
  expect(body).toContain("tribleera-vaibhavam.vercel.app");
});
