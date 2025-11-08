import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'verification-screenshots/full-page.png', fullPage: true });
  
  // Screenshot Next Up section
  const nextUpBar = await page.locator('text=Next Up for Hold').first();
  if (await nextUpBar.isVisible()) {
    await nextUpBar.screenshot({ path: 'verification-screenshots/next-up-section.png' });
  }
  
  // Screenshot header
  await page.screenshot({ 
    path: 'verification-screenshots/header.png',
    clip: { x: 0, y: 0, width: 1920, height: 120 }
  });
  
  console.log('Screenshots saved to verification-screenshots/');
  await browser.close();
})();
