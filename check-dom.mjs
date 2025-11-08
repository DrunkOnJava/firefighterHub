import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Check if NextUpBarV2 rendered
  const nextUpText = await page.locator('text=Next Up for Hold').count();
  console.log('Found "Next Up for Hold":', nextUpText);
  
  // Check for new card design
  const cards = await page.locator('[aria-label*="Next up for Shift"]').count();
  console.log('Found shift cards:', cards);
  
  // Check header
  const firefighterHub = await page.locator('text=FirefighterHub').count();
  console.log('Found "FirefighterHub" branding:', firefighterHub);
  
  // Check for gradient pills in calendar
  const gradientPills = await page.locator('.bg-gradient-to-r').count();
  console.log('Found gradient elements:', gradientPills);
  
  // Get console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.reload();
  await page.waitForTimeout(2000);
  
  if (errors.length > 0) {
    console.log('\nConsole Errors:');
    errors.forEach(err => console.log('  -', err));
  } else {
    console.log('\nNo console errors');
  }
  
  await browser.close();
})();
