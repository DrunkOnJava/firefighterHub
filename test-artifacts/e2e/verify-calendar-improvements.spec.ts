import { test } from '@playwright/test';

test('verify blue TODAY highlight and orange hold pills', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://firefighter-hub.vercel.app', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  
  await page.waitForTimeout(3000);
  
  // Take screenshot showing:
  // 1. Blue TODAY cell with glow
  // 2. Orange scheduled hold pills
  // 3. Green completed hold pills
  // 4. Rounded corners on day cells
  await page.screenshot({ 
    path: '/tmp/blue-today-highlight-orange-hold-pills-green-completed.png',
    fullPage: true
  });
  
  // Get color verification
  const colors = await page.evaluate(() => {
    const today = document.querySelector('.rbc-today');
    const events = Array.from(document.querySelectorAll('.rbc-event'));
    
    if (today) {
      const todayStyle = window.getComputedStyle(today);
      return {
        todayBackground: todayStyle.backgroundColor,
        todayBorder: todayStyle.borderColor,
        todayShadow: todayStyle.boxShadow,
        eventCount: events.length,
        eventClasses: events.map(e => e.className),
      };
    }
    return null;
  });
  
  console.log('\n=== COLOR VERIFICATION ===');
  console.log(JSON.stringify(colors, null, 2));
  console.log('\n✅ Screenshot saved as: blue-today-highlight-orange-hold-pills-green-completed.png');
  console.log('   Look for:');
  console.log('   - TODAY cell: Blue background with glow shadow');
  console.log('   - Scheduled holds: Orange pills with left border');
  console.log('   - Completed holds: Green pills (75% opacity)');
  console.log('   - Day cells: Rounded 8px corners with 2px gaps');
});
