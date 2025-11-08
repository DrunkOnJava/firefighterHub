import { test, expect } from '@playwright/test';

test('capture roster table screenshot', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the latest deployment
  await page.goto('https://firefighter-d5x60gafh-griffins-projects-c51c3288.vercel.app');
  
  // Wait for the table to be visible
  await page.waitForSelector('table', { timeout: 10000 });
  
  // Wait a bit for data to load
  await page.waitForTimeout(2000);
  
  // Take screenshot of the full page
  await page.screenshot({ 
    path: '/tmp/roster-screenshot.png',
    fullPage: true
  });
  
  // Get row heights for analysis
  const rowData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.slice(0, 10).map((row, i) => {
      const rect = row.getBoundingClientRect();
      return {
        index: i + 1,
        offsetHeight: row.offsetHeight,
        clientHeight: row.clientHeight,
        boundingHeight: rect.height,
        computedHeight: window.getComputedStyle(row).height
      };
    });
  });
  
  console.log('\n=== ROW HEIGHT ANALYSIS ===');
  console.log(JSON.stringify(rowData, null, 2));
  
  // Get cell padding info
  const cellPadding = await page.evaluate(() => {
    const firstCell = document.querySelector('tbody tr td');
    if (!firstCell) return null;
    const styles = window.getComputedStyle(firstCell);
    return {
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      height: styles.height,
      maxHeight: styles.maxHeight,
    };
  });
  
  console.log('\n=== CELL STYLING ===');
  console.log(JSON.stringify(cellPadding, null, 2));
  
  console.log('\nScreenshot saved to: /tmp/roster-screenshot.png');
});
