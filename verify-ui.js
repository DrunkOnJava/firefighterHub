const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'verification-screenshots/full-page.png', fullPage: true });
  
  // Screenshot Next Up section
  await page.screenshot({ 
    path: 'verification-screenshots/next-up-section.png',
    clip: { x: 0, y: 100, width: 1920, height: 400 }
  });
  
  // Screenshot header
  await page.screenshot({ 
    path: 'verification-screenshots/header.png',
    clip: { x: 0, y: 0, width: 1920, height: 100 }
  });
  
  // Screenshot calendar with event pills
  await page.screenshot({ 
    path: 'verification-screenshots/calendar.png',
    clip: { x: 0, y: 500, width: 1200, height: 800 }
  });
  
  console.log('Screenshots saved to verification-screenshots/');
  await browser.close();
})();
