import { test, expect } from "@playwright/test";

test.describe("FirefighterHub Layout Snapshot Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForSelector("#main-content", { timeout: 10000 });
  });

  test("Desktop layout - 1440x900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot("layout-desktop-1440x900.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Tablet layout - 768x1024", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot("layout-tablet-768x1024.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Mobile layout - 375x667", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot("layout-mobile-375x667.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
