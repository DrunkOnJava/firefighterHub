import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Get card HTML and styles
  const card = page.locator('[aria-label*="Next up for Shift A"]').first();
  
  const html = await card.innerHTML();
  console.log('=== CARD HTML (first 1000 chars) ===');
  console.log(html.substring(0, 1000));
  
  const styles = await card.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      display: computed.display,
      flexDirection: computed.flexDirection,
      height: computed.height,
      minHeight: computed.minHeight,
      overflow: computed.overflow,
      padding: computed.padding,
    };
  });
  
  console.log('\n=== CARD COMPUTED STYLES ===');
  console.log(JSON.stringify(styles, null, 2));
  
  // Check if content is inside
  const nameElement = await card.locator('text=Angel Hernandez').count();
  const stationElement = await card.locator('text=/Station/').count();
  
  console.log('\n=== CONTENT DETECTION ===');
  console.log('Found firefighter name:', nameElement > 0 ? 'YES' : 'NO');
  console.log('Found station info:', stationElement > 0 ? 'YES' : 'NO');
  
  // Get full card screenshot with padding
  await card.screenshot({ 
    path: 'verification-screenshots/DEBUG-card-with-padding.png' 
  });
  
  await browser.close();
})();
