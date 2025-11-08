import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ 
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'verification-screenshots/COMPLETE-fullpage.png',
    fullPage: true
  });
  
  // Take screenshot of just the Next Up section with more context
  await page.evaluate(() => {
    const section = document.querySelector('[class*="border-b"]');
    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({
    path: 'verification-screenshots/COMPLETE-next-up-section.png',
    clip: { x: 0, y: 100, width: 1920, height: 500 }
  });
  
  // Measure visible content
  const measurements = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[aria-label*="Next up for Shift"]'));
    return cards.map(card => {
      const rect = card.getBoundingClientRect();
      const name = card.querySelector('.text-2xl')?.textContent;
      const station = card.querySelector('text=/Station/')?.textContent;
      return {
        name,
        station,
        visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
        height: rect.height,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom
      };
    });
  });
  
  console.log('\n=== CARD MEASUREMENTS ===');
  measurements.forEach((m, i) => {
    console.log(`\nCard ${i + 1}:`);
    console.log(`  Name: ${m.name}`);
    console.log(`  Size: ${m.width.toFixed(0)}px × ${m.height}px`);
    console.log(`  Position: top=${m.top.toFixed(0)}, bottom=${m.bottom.toFixed(0)}`);
    console.log(`  Visible: ${m.visible ? 'YES' : 'NO'}`);
  });
  
  // Keep browser open for manual inspection
  console.log('\n✅ Screenshots saved. Browser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
