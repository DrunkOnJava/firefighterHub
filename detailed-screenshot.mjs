import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Full page
  await page.screenshot({ path: 'verification-screenshots/current-full-page.png', fullPage: true });
  
  // Just the Next Up section
  const nextUpSection = page.locator('text=Next Up for Hold').locator('..').locator('..');
  if (await nextUpSection.isVisible()) {
    await nextUpSection.screenshot({ path: 'verification-screenshots/current-next-up.png' });
  }
  
  // Header only
  await page.screenshot({ 
    path: 'verification-screenshots/current-header.png',
    clip: { x: 0, y: 0, width: 1920, height: 150 }
  });
  
  // Get HTML of Next Up section
  const nextUpHTML = await nextUpSection.innerHTML();
  console.log('Next Up HTML snippet (first 500 chars):');
  console.log(nextUpHTML.substring(0, 500));
  
  console.log('\nScreenshots saved!');
  
  await browser.close();
})();
