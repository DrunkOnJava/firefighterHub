# FirefighterHub Visual Regression Testing

Automated Playwright tests to capture screenshots of UI components and track visual changes over time.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

3. Update `BASE_URL` in `firefighterhub-visual-tests.spec.js` to match your local or deployed URL:
```javascript
const BASE_URL = 'http://localhost:3000'; // Change this to your URL
```

## Running Tests

### Capture Current Screenshots
```bash
npm run test:visual
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Update Baseline Screenshots
After confirming the UI looks correct, update baselines:
```bash
npm run test:update-baseline
```

### View Test Report
```bash
npm run test:report
```

## Screenshot Organization

```
screenshots/
├── baseline/          # Reference screenshots (committed to git)
├── current/           # Latest test run screenshots
└── diff/             # Visual diffs (if comparison fails)
```

## Test Coverage

The test suite captures screenshots of:

### Full Page
- Complete page screenshot (desktop, tablet, mobile)

### Header & Navigation
- Top navigation bar
- FirefighterHub logo and branding
- Shift selector buttons (A, B, C)
- Toolbar buttons (Print, Activity, Light, BC Mode, Help)

### Calendar Components
- Full calendar view (November 2025)
- Calendar navigation controls
- Individual hold event pills/badges
- Week view timeline

### Shift Panels
- "Next Up" section
- Individual shift panels (A, B, C) with color coding

### Roster Components
- Complete firefighter roster table
- Filter and Export buttons
- Table header row
- Individual roster rows
- Filter modal/panel

### Responsive Views
- Mobile header (375px)
- Mobile calendar (375px)
- Tablet full page (768px)

## Customizing Tests

### Add New Component Tests

Edit `firefighterhub-visual-tests.spec.js`:

```javascript
test('Your component name', async ({ page }) => {
  const component = page.locator('[data-testid="your-component"]');
  if (await component.count() > 0) {
    await component.screenshot({
      path: path.join(CURRENT_DIR, 'firefighterhub-your-component.png')
    });
  }
});
```

### Update Selectors

The tests use various selector strategies:
- `data-testid` attributes (recommended - add these to your components)
- CSS classes
- Text content
- Role attributes

Add `data-testid` attributes to your components for reliable selection:

```html
<div data-testid="calendar-container">
  <button data-testid="shift-a-button">Shift A</button>
</div>
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd visual-regression-tests
          npm ci
          npx playwright install --with-deps chromium
      
      - name: Run visual tests
        run: |
          cd visual-regression-tests
          npm run test:visual
      
      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: visual-regression-tests/screenshots/
```

## Comparison Workflow

1. **Initial Setup**: Run tests to create baseline screenshots
2. **Make UI Changes**: Update your FirefighterHub components
3. **Run Tests**: Execute tests to capture new screenshots
4. **Review Differences**: Compare current vs baseline
5. **Update Baseline**: If changes are intentional, update baseline screenshots
6. **Commit**: Add baseline screenshots to version control

## Tips

- Run tests in headless mode for CI/CD
- Use `--ui` flag for debugging and exploring tests
- Set `maxDiffPixels` threshold to allow minor rendering differences
- Keep baseline screenshots in version control
- Run tests on multiple viewport sizes
- Take screenshots at consistent points (after animations complete)

## Troubleshooting

**Tests failing to find elements?**
- Check if `BASE_URL` is correct
- Ensure page is fully loaded (`waitForLoadState`)
- Add `data-testid` attributes to components
- Use Playwright UI mode to inspect selectors

**Screenshots look different on CI vs local?**
- Font rendering may vary between OS
- Set consistent viewport sizes
- Use Docker for consistent environment
- Increase `maxDiffPixels` tolerance

**Tests timing out?**
- Increase timeout in `playwright.config.js`
- Add explicit waits for dynamic content
- Check network requests complete
