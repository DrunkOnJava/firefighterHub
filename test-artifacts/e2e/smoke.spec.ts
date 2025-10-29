import { test, expect } from "@playwright/test";

/**
 * Example E2E Test - Application Smoke Test
 *
 * This is a basic smoke test to verify the application loads.
 * More comprehensive E2E tests will be added as component testing progresses.
 */

test.describe("FirefighterHub - Smoke Tests", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");

    // Check that the page title matches the actual title in index.html
    await expect(page).toHaveTitle(/Hold List Manager/i);
  });

  test("should display shift selector", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, need to open the menu first
      const menuButton = page.getByRole("button", { name: /menu/i });
      await menuButton.click();

      // Wait for mobile nav to open
      await page.waitForSelector('[aria-label="Close menu"]');
    }

    // Look for shift buttons using aria-label
    const shiftA = page.getByRole("button", { name: /switch to shift a/i });
    const shiftB = page.getByRole("button", { name: /switch to shift b/i });
    const shiftC = page.getByRole("button", { name: /switch to shift c/i });

    await expect(shiftA).toBeVisible();
    await expect(shiftB).toBeVisible();
    await expect(shiftC).toBeVisible();
  });

  test("should be able to switch shifts", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, need to open the menu first
      const menuButton = page.getByRole("button", { name: /menu/i });
      await menuButton.click();

      // Wait for mobile nav to open
      await page.waitForSelector('[aria-label="Close menu"]');
    }

    // Click on Shift B using aria-label
    const shiftB = page.getByRole("button", { name: /switch to shift b/i });
    await shiftB.click();

    // Verify Shift B is now active (uses aria-pressed, not aria-selected)
    await expect(shiftB).toHaveAttribute("aria-pressed", "true");
  });

  test("should display firefighter list", async ({ page }) => {
    await page.goto("/");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check that the main content area is visible
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("should handle responsive layout", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, verify mobile menu button exists
      const menuButton = page.getByRole("button", { name: /menu/i });
      await expect(menuButton).toBeVisible();
    } else {
      // On desktop, verify shift selector is directly visible
      const shiftA = page.getByRole("button", { name: /switch to shift a/i });
      await expect(shiftA).toBeVisible();
    }
  });
});
