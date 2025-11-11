# Grid System Testing Guide

## Quick Visual Tests

### 1. Grid Overlay (Development Mode)

**Start dev server:**
```bash
pnpm dev
```

**Open browser:** http://localhost:5173

**Toggle grid overlay:**
- Press `Ctrl+G` (or `Cmd+G` on Mac) to show/hide grid overlay
- Press `Ctrl+Shift+G` to cycle through grid types:
  - `baseline` - Red horizontal lines (8px rhythm)
  - `columns` - Blue (calendar) and green (sidebar) columns
  - `calendar` - Orange calendar grid cells
  - `all` - All overlays combined
  - `none` - No overlay

**Adjust opacity:**
- Press `Ctrl+Shift+↑` to increase opacity
- Press `Ctrl+Shift+↓` to decrease opacity

### 2. Manual Inspection Checklist

#### Desktop Layout (≥1024px)
- [ ] Calendar and sidebar are side-by-side
- [ ] Calendar fills available space (1fr)
- [ ] Sidebar is fixed at 480px width
- [ ] No vertical scrolling on main content
- [ ] Calendar cells have consistent aspect ratio (slightly taller than square)
- [ ] All 6 weeks visible in calendar grid
- [ ] Roster shows 20 rows without overflow

#### Tablet Layout (768-1023px)
- [ ] Calendar and sidebar are stacked vertically
- [ ] Calendar above roster
- [ ] Single column layout
- [ ] Limited scrolling as needed

#### Mobile Layout (≤767px)
- [ ] Flex column layout
- [ ] Full page scrolling enabled
- [ ] Calendar cells are square (1:1 aspect)
- [ ] Touch targets are at least 44px
- [ ] Roster columns stack (single column)

### 3. Responsive Breakpoint Testing

**Test at these exact widths:**
- 375px (iPhone SE)
- 640px (Mobile breakpoint)
- 768px (Tablet breakpoint)
- 1024px (Desktop breakpoint)
- 1920px (Wide desktop)

**Use browser DevTools:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "Responsive" mode
4. Enter exact width in dimension field
5. Verify layout at each breakpoint

### 4. Calendar Grid Verification

**Check calendar cells:**
- [ ] 7 columns (one per weekday)
- [ ] Equal width columns
- [ ] Consistent cell heights within rows
- [ ] Proper gaps (8px desktop, 6px tablet, 4px mobile)
- [ ] No overflow from cell content
- [ ] Aspect ratio maintains visual balance

**Check hold cards:**
- [ ] Hold cards fit within cells
- [ ] Multiple holds on same day are visible
- [ ] "+X more" button shows when needed
- [ ] Cards don't break cell boundaries

### 5. Roster Grid Verification

**Check roster layout:**
- [ ] 3 columns: Name (1.2fr), Station (0.5fr), Certs (0.8fr)
- [ ] Columns align with header
- [ ] 20 rows visible without scrolling (desktop)
- [ ] Rows have minimum 32px height
- [ ] Hover effects work correctly

**Mobile roster:**
- [ ] Single column (stacked)
- [ ] All content visible
- [ ] Proper spacing between items

### 6. Spacing Verification

**Use grid overlay to check:**
- [ ] All vertical spacing is multiple of 8px
- [ ] Gaps match defined values (16px desktop, 12px mobile)
- [ ] Padding follows baseline grid
- [ ] No arbitrary spacing values

### 7. Alignment Verification

**Check element alignment:**
- [ ] Calendar cells align to column grid
- [ ] Roster rows align properly
- [ ] Form labels/inputs align
- [ ] Text aligns consistently

### 8. Cross-Browser Testing

**Test in:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

**Check for:**
- CSS Grid support
- `aspect-ratio` support
- Gap property support
- Subgrid support (optional)

## Automated Testing

### TypeScript Type Check
```bash
pnpm typecheck
```

**Expected:** No grid-related type errors

### Build Test
```bash
pnpm build
```

**Expected:** Successful build with no errors

### Lint Check
```bash
pnpm lint
```

**Expected:** No linting errors in grid system files

## Visual Regression Tests (Playwright)

### Calendar Grid Test
```typescript
test('calendar grid renders correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check grid structure
  const cells = await page.locator('.cell').count();
  expect(cells).toBe(42); // 7 days × 6 weeks
  
  // Check aspect ratio
  const cell = page.locator('.cell').first();
  const box = await cell.boundingBox();
  if (box) {
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(1 / 1.2, 1); // Allow 0.1 tolerance
  }
});
```

### Responsive Layout Test
```typescript
const viewports = [
  { width: 375, height: 667 },   // Mobile
  { width: 768, height: 1024 },  // Tablet
  { width: 1920, height: 1080 }, // Desktop
];

for (const viewport of viewports) {
  test(`layout at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    
    // Visual snapshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
}
```

## Common Issues & Fixes

### Issue: Calendar cells overflow
**Cause:** Missing `min-h-0` on grid container
**Fix:** Add `min-h-0` to `.calendar` and `.grid` classes

### Issue: Unequal row heights
**Cause:** Using `grid-template-rows` instead of `grid-auto-rows`
**Fix:** Use `grid-auto-rows: 1fr` for equal heights

### Issue: Grid overlay not showing
**Cause:** Running in production mode
**Fix:** Use development mode (`pnpm dev`)

### Issue: Calendar cells not square on mobile
**Cause:** Missing `aspect-ratio` CSS
**Fix:** Ensure `aspect-ratio: 1/1` is applied at mobile breakpoint

### Issue: Roster columns misaligned
**Cause:** Different `grid-template-columns` on header vs rows
**Fix:** Use same column definition (`1.2fr 0.5fr 0.8fr`)

## Performance Checks

### Layout Shifts
- [ ] No CLS (Cumulative Layout Shift) on page load
- [ ] Grid stabilizes quickly
- [ ] No layout thrashing during resize

### Paint Performance
- [ ] Grid renders in <100ms
- [ ] No excessive repaints during scroll
- [ ] Smooth transitions between breakpoints

### Memory Usage
- [ ] No memory leaks from grid overlay
- [ ] Grid utilities don't bloat bundle size

## Accessibility Checks

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible on grid elements
- [ ] Calendar cells keyboard accessible

### Touch Targets
- [ ] All buttons/links ≥44px touch target
- [ ] Mobile calendar cells ≥48px
- [ ] Sufficient spacing between targets

### Screen Readers
- [ ] Grid structure announced correctly
- [ ] Cell content readable
- [ ] Row/column headers identified

## Sign-Off Checklist

Before considering grid system complete:

- [ ] All visual tests pass
- [ ] Responsive behavior correct at all breakpoints
- [ ] TypeScript compiles without grid-related errors
- [ ] Production build succeeds
- [ ] Documentation is complete
- [ ] Grid overlay works in dev mode
- [ ] Calendar rendering issues fixed
- [ ] No layout overflow on desktop
- [ ] Mobile scrolling enabled
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility verified

## Next Steps

After testing:

1. **If issues found:**
   - Document issue in GRID_SYSTEM.md
   - Create fix in gridSystem.ts or index.css
   - Re-test affected areas

2. **If all tests pass:**
   - Commit grid system implementation
   - Update main documentation
   - Share grid overlay keyboard shortcuts with team
   - Begin migrating components to use grid utilities

## Resources

- Main documentation: `docs/GRID_SYSTEM.md`
- Implementation summary: `GRID_SYSTEM_IMPLEMENTATION.md`
- Grid configuration: `src/styles/gridSystem.ts`
- Grid utilities: `src/styles/gridUtilities.ts`
- Grid overlay: `src/components/GridOverlay.tsx`
