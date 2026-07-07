import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "https://tribleera-vaibhavam.vercel.app",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    { name: "Desktop Chrome", use: { viewport: { width: 1280, height: 720 } } },
    { name: "Mobile Safari", use: { viewport: { width: 375, height: 667 } } },
  ],
});
