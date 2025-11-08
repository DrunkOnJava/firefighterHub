# Grid and Alignment System Documentation

## Overview

FirefighterHub uses a comprehensive grid and alignment system that creates visual order and rhythm across all interface elements. The system provides both mathematical precision and content-appropriate flexibility.

**Key Features:**
- 8px baseline grid for vertical rhythm
- CSS Grid with named lines and template areas
- Responsive behavior across all viewports (mobile, tablet, desktop)
- Modular scale (1.25 ratio) for proportional sizing
- Subgrid support for nested alignment

## Table of Contents

1. [Baseline Grid](#baseline-grid)
2. [Column Grid System](#column-grid-system)
3. [Calendar Grid](#calendar-grid)
4. [Roster Grid](#roster-grid)
5. [Modular Scale](#modular-scale)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Grid Utilities](#grid-utilities)
10. [When to Break the Grid](#when-to-break-the-grid)

---

## Baseline Grid

All vertical spacing aligns to an **8px baseline grid** for visual harmony.

### Configuration

```typescript
import { baseline } from '@/styles';

baseline.unit        // 8px
baseline.lineHeight  // 1.5 (24px for 16px font)
baseline.scale.sm    // 8px
baseline.scale.md    // 16px
baseline.scale.lg    // 24px
baseline.scale.xl    // 32px
```

### Usage

**CSS Variables:**
```css
:root {
  --baseline-unit: 8px;
  --grid-base-unit: 8px;
}

/* Spacing should be multiples of 8px */
.element {
  margin-bottom: 16px;  /* 2 × baseline */
  padding: 24px;        /* 3 × baseline */
  gap: 8px;             /* 1 × baseline */
}
```

**Tailwind Classes:**
```tsx
<div className="mb-4 p-6 gap-2">  {/* 16px, 24px, 8px */}
  Content
</div>
```

### Why 8px?

- Clean multiples (16px, 24px, 32px, 40px, 48px)
- Aligns with most design systems (Material, Bootstrap, etc.)
- Easy mental math for developers
- Works with Tailwind's spacing scale

---

## Column Grid System

### Desktop Layout

**Two-column grid:** Calendar (flexible) + Sidebar (fixed 480px)

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 480px;
  grid-template-areas: "calendar sidebar";
  gap: 16px;
}
```

**Named Areas:**
```tsx
<div className="layout">
  <section className="calendar" style={{ gridArea: 'calendar' }}>
    {/* Calendar content */}
  </section>
  <aside className="sidebar" style={{ gridArea: 'sidebar' }}>
    {/* Roster content */}
  </aside>
</div>
```

### Tablet Layout

**Single column, stacked:**

```css
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "calendar"
      "sidebar";
  }
}
```

### Mobile Layout

**Flex column (scrollable):**

```css
@media (max-width: 767px) {
  .layout {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: auto;  /* Enable scrolling */
  }
}
```

---

## Calendar Grid

### Desktop (7×6 Grid)

**Configuration:**
```css
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;  /* Equal height rows */
  gap: 8px;
}

.calendar-cell {
  aspect-ratio: 1 / 1.2;  /* Slightly taller than square */
  min-height: 80px;
  overflow: hidden;
}
```

**Why `grid-auto-rows` instead of `grid-template-rows`?**
- Allows grid to calculate row height based on available space
- Prevents overflow when calendar container is constrained
- Ensures all 6 rows (max weeks in a month) fit in view

### Tablet

```css
@media (max-width: 1024px) {
  .calendar-cell {
    aspect-ratio: 1 / 1.1;
    min-height: 60px;
  }
}
```

### Mobile (Week View)

```css
@media (max-width: 767px) {
  .calendar-grid {
    grid-template-columns: repeat(7, minmax(48px, 1fr));
    gap: 4px;
  }
  
  .calendar-cell {
    aspect-ratio: 1 / 1;  /* Square cells */
    min-height: 48px;     /* WCAG touch target */
  }
}
```

### Layout Structure

```
┌─────────────────────────────────────────────┐
│ Calendar Header (24px)                      │
├─────────────────────────────────────────────┤
│ Day Headers (S M T W T F S)                 │
├───┬───┬───┬───┬───┬───┬───┐                 
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  Week 1         
├───┼───┼───┼───┼───┼───┼───┤                 
│ 8 │ 9 │10 │11 │12 │13 │14 │  Week 2         
├───┼───┼───┼───┼───┼───┼───┤                 
│...│...│...│...│...│...│...│  Weeks 3-6      
└───┴───┴───┴───┴───┴───┴───┘                 
```

---

## Roster Grid

### Three-Column Layout

**Column proportions:** Name (1.2fr) : Station (0.5fr) : Certs (0.8fr)

```css
.roster-header,
.roster-row {
  display: grid;
  grid-template-columns: 1.2fr 0.5fr 0.8fr;
  gap: 8px;
  align-items: center;
}
```

**Why fractional units (fr)?**
- Proportional sizing (not fixed pixels)
- Columns grow/shrink together
- Maintains visual balance across viewport sizes

### 20 Visible Rows

```css
.roster-rows {
  display: grid;
  grid-template-rows: repeat(20, 1fr);
  gap: 4px;
  flex: 1;
}

.roster-row {
  min-height: 32px;  /* Enough for content */
}
```

**Why 20 rows?**
- Shows all firefighters without scrolling (typical roster size)
- Fits comfortably in sidebar height on 1080p+ screens
- Allows quick scanning of entire roster

### Mobile

```css
@media (max-width: 767px) {
  .roster-row {
    grid-template-columns: 1fr;  /* Stack columns */
    gap: 8px;
  }
  
  .roster-rows {
    grid-template-rows: auto;  /* Auto-height */
  }
}
```

---

## Modular Scale

### Mathematical Relationships

**Ratio:** 1.25 (Major Third in music theory)  
**Base:** 16px

**Scale values:**
```typescript
{
  '-2': 10px,   // 16 / 1.25²
  '-1': 13px,   // 16 / 1.25
  0:    16px,   // Base
  1:    20px,   // 16 × 1.25
  2:    25px,   // 16 × 1.25²
  3:    31px,   // 16 × 1.25³
  4:    39px,   // 16 × 1.25⁴
  5:    49px,   // 16 × 1.25⁵
  6:    61px,   // 16 × 1.25⁶
  7:    76px,   // 16 × 1.25⁷
  8:    95px,   // 16 × 1.25⁸
}
```

### Usage

**Component sizing:**
```tsx
import { modularScale } from '@/styles';

// Use scale values instead of arbitrary numbers
const buttonSizes = {
  small: modularScale.scale['-1'],   // 13px
  medium: modularScale.scale[0],     // 16px
  large: modularScale.scale[1],      // 20px
};

// Or use semantic aliases
const iconSize = modularScale.aliases.medium;  // 20px
```

**Why modular scale?**
- Creates visual harmony through proportional relationships
- Reduces arbitrary "magic numbers" in code
- Easier to maintain consistent sizing across components
- Based on musical harmony (Major Third = 1.25 ratio)

---

## Responsive Breakpoints

Aligned with Tailwind's default breakpoints:

```typescript
{
  mobile: 640px,      // 0-640px
  tablet: 768px,      // 641-768px
  desktop: 1024px,    // 769-1024px
  wide: 1280px,       // 1025-1280px
  ultrawide: 1536px,  // 1281px+
}
```

### Breakpoint Strategy

**Mobile-first approach:**
```css
/* Base styles (mobile) */
.element {
  font-size: 14px;
  padding: 8px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    font-size: 16px;
    padding: 12px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: 18px;
    padding: 16px;
  }
}
```

**Tailwind classes:**
```tsx
<div className="text-sm md:text-base lg:text-lg p-2 md:p-3 lg:p-4">
  Responsive sizing
</div>
```

---

## Usage Examples

### Example 1: Calendar Component

```tsx
import { gridUtilities } from '@/styles';

function Calendar() {
  return (
    <div className="flex flex-col min-h-0">
      {/* Weekday header */}
      <div className={gridUtilities.calendar.weekdayHeader}>
        {weekdays.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      
      {/* Day grid */}
      <div className={gridUtilities.calendar.dayGrid}>
        {days.map(day => (
          <div key={day.date} className={gridUtilities.calendar.dayCell}>
            <span className="text-sm font-bold">{day.number}</span>
            {/* Hold cards */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Roster Row

```tsx
import { gridUtilities } from '@/styles';

function RosterRow({ firefighter }) {
  return (
    <div className={gridUtilities.roster.row}>
      <span className="truncate">{firefighter.name}</span>
      <span className="text-center text-muted">{firefighter.station}</span>
      <div className="flex gap-2 justify-end">
        {/* Certification badges */}
      </div>
    </div>
  );
}
```

### Example 3: Responsive Form

```tsx
import { gridUtilities, alignmentUtilities } from '@/styles';

function Form() {
  return (
    <form className={gridUtilities.form.container}>
      <label className={gridUtilities.form.labelColumn}>Name:</label>
      <input className={gridUtilities.form.inputColumn} />
      
      <label className={gridUtilities.form.labelColumn}>Station:</label>
      <input className={gridUtilities.form.inputColumn} />
    </form>
  );
}
```

### Example 4: Subgrid (Nested Alignment)

```tsx
import { subgridUtilities } from '@/styles';

function ParentGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Child inherits parent grid */}
      <div className={subgridUtilities.columns}>
        {/* These align to parent's column lines */}
        <span>Column 1</span>
        <span>Column 2</span>
        <span>Column 3</span>
      </div>
    </div>
  );
}
```

---

## Best Practices

### ✅ DO

1. **Use baseline multiples for spacing**
   ```tsx
   <div className="mb-4 p-6">  {/* 16px, 24px = multiples of 8 */}
   ```

2. **Follow modular scale for sizing**
   ```tsx
   import { modularScale } from '@/styles';
   const size = modularScale.scale[2];  // 25px
   ```

3. **Use named grid areas for semantic layouts**
   ```css
   grid-template-areas: "header header" "sidebar content";
   ```

4. **Keep minimum touch targets at 44px (WCAG)**
   ```tsx
   <button className="min-h-[44px] min-w-[44px]">
   ```

5. **Use `min-h-0` on grid children to prevent overflow**
   ```tsx
   <div className="grid grid-cols-2 min-h-0">
   ```

### ❌ DON'T

1. **Don't use arbitrary spacing values**
   ```tsx
   {/* ❌ Bad */}
   <div className="mb-[13px] p-[19px]">
   
   {/* ✅ Good */}
   <div className="mb-4 p-6">  {/* 16px, 24px */}
   ```

2. **Don't hardcode pixel widths for columns**
   ```css
   /* ❌ Bad */
   grid-template-columns: 300px 200px;
   
   /* ✅ Good */
   grid-template-columns: 1.5fr 1fr;
   ```

3. **Don't forget `min-h-0` on scrollable grid children**
   ```tsx
   {/* ❌ Bad - will overflow */}
   <div className="grid">
     <div className="overflow-auto">...</div>
   </div>
   
   {/* ✅ Good */}
   <div className="grid min-h-0">
     <div className="overflow-auto min-h-0">...</div>
   </div>
   ```

4. **Don't mix grid systems arbitrarily**
   - Stick to the defined presets in `gridUtilities`
   - If you need a custom grid, add it to the design system

---

## Grid Utilities

### Pre-built Utility Classes

Import from `@/styles`:

```tsx
import { 
  gridUtilities,
  alignmentUtilities,
  spacingUtilities,
  responsiveUtilities,
  subgridUtilities,
} from '@/styles';
```

### Available Utilities

**Layout:**
- `gridUtilities.appLayout.container` - Main app grid
- `gridUtilities.calendar.container` - Calendar grid
- `gridUtilities.roster.header` - Roster header
- `gridUtilities.roster.row` - Roster row
- `gridUtilities.form.container` - Form layout

**Alignment:**
- `alignmentUtilities.flex.center` - Centered flex
- `alignmentUtilities.flex.between` - Space-between flex
- `alignmentUtilities.grid.center` - Centered grid items
- `alignmentUtilities.text.left` - Left-aligned text

**Spacing:**
- `spacingUtilities.padding.md` - Medium padding (16px)
- `spacingUtilities.gap.lg` - Large gap (24px)

**Responsive:**
- `responsiveUtilities.visibility.mobileOnly` - Show on mobile only
- `responsiveUtilities.columns.responsive1to3` - 1 → 2 → 3 columns

---

## When to Break the Grid

### Intentional Grid Breaking

Sometimes breaking the grid creates better design. Valid reasons:

1. **Visual emphasis** - Full-bleed images or hero sections
2. **Asymmetric layouts** - Creating visual interest
3. **Overlapping elements** - Cards that span grid lines
4. **Content-specific needs** - Tables, charts, diagrams

### How to Break the Grid Properly

```tsx
{/* Break out of parent grid */}
<div className="col-span-full">  {/* Spans all columns */}
  <img src="hero.jpg" className="w-full" />
</div>

{/* Offset from grid */}
<div className="relative left-[-20px]">
  {/* Extends beyond grid boundary */}
</div>

{/* Custom grid within grid */}
<div className="grid grid-cols-5 gap-3">  {/* Non-standard 5-col */}
  {/* Specialized layout */}
</div>
```

### Document Your Breaks

When intentionally breaking the grid, add a comment:

```tsx
{/* GRID BREAK: Full-width hero image for visual impact */}
<div className="col-span-full -mx-4">
  <img src="hero.jpg" alt="Hero" />
</div>
```

---

## Visual Examples

### Desktop Layout

```
┌────────────────────────────────────────────────────────┐
│                      Header (64px)                     │
├──────────────────────────────────┬─────────────────────┤
│                                  │                     │
│          Calendar (1fr)          │   Roster (480px)    │
│                                  │                     │
│  ┌─────────────────────────┐    │  ┌───────────────┐  │
│  │   Next Up Bar (3-col)   │    │  │  Next Up Bar  │  │
│  ├─────────────────────────┤    │  ├───────────────┤  │
│  │                         │    │  │               │  │
│  │    Calendar Grid        │    │  │  Roster List  │  │
│  │      (7 × 6 grid)       │    │  │  (20 rows)    │  │
│  │                         │    │  │               │  │
│  └─────────────────────────┘    │  └───────────────┘  │
│                                  │                     │
└──────────────────────────────────┴─────────────────────┘
```

### Mobile Layout (Scrollable)

```
┌──────────────────────┐
│   Header (48px)      │
├──────────────────────┤
│                      │ ← Scrollable
│  Next Up Bar (3-col) │
├──────────────────────┤
│                      │
│   Calendar (Week)    │
│   (7-col horizontal) │
│                      │
├──────────────────────┤
│                      │
│    Roster List       │
│  (Single column)     │
│                      │
│        ...           │
└──────────────────────┘
```

---

## CSS Custom Properties Reference

All grid values are available as CSS variables:

```css
:root {
  /* Grid system */
  --grid-base-unit: 8px;
  --grid-desktop-gap: 16px;
  --grid-tablet-gap: 16px;
  --grid-mobile-gap: 12px;
  
  /* Calendar */
  --calendar-gap-desktop: 8px;
  --calendar-gap-tablet: 6px;
  --calendar-gap-mobile: 4px;
  
  /* Roster */
  --roster-gap: 8px;
  
  /* Baseline */
  --baseline-unit: 8px;
}
```

**Usage:**
```css
.custom-element {
  gap: var(--grid-desktop-gap);
  padding: calc(var(--baseline-unit) * 2);  /* 16px */
}
```

---

## TypeScript Support

Full type safety for grid system:

```typescript
import { 
  GridSystem,
  baseline,
  columnGrid,
  calendarGrid,
  rosterGrid,
  modularScale,
} from '@/styles';

// Type-safe access
const gap: number = baseline.scale.md;  // 16
const columns: string = columnGrid.desktop.columns;  // "1fr 480px"
```

---

## Testing Grid Layouts

### Visual Regression Tests

Use Playwright for visual testing:

```typescript
test('calendar grid renders correctly', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.calendar-grid');
  
  // Check grid structure
  const cells = await page.locator('.calendar-cell').count();
  expect(cells).toBe(42);  // 7 days × 6 weeks
  
  // Visual snapshot
  await expect(page.locator('.calendar-grid')).toHaveScreenshot();
});
```

### Responsive Testing

Test at all breakpoints:

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
    await expect(page).toHaveScreenshot();
  });
}
```

---

## Browser Support

### Grid Features

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| Subgrid | ✅ 117+ | ✅ 71+ | ✅ 16+ | ✅ 117+ |
| `gap` | ✅ 66+ | ✅ 61+ | ✅ 12+ | ✅ 79+ |
| `aspect-ratio` | ✅ 88+ | ✅ 89+ | ✅ 15+ | ✅ 88+ |

### Fallbacks

For older browsers without subgrid support:

```css
.child-grid {
  /* Fallback: inherit parent grid */
  grid-template-columns: inherit;
  
  /* Modern: use subgrid */
  @supports (grid-template-columns: subgrid) {
    grid-template-columns: subgrid;
  }
}
```

---

## Additional Resources

- [MDN: CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Tricks: Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Tailwind CSS Grid Documentation](https://tailwindcss.com/docs/grid-template-columns)
- [WCAG Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Modular Scale Calculator](https://www.modularscale.com/)

---

## Changelog

### v1.0.0 (2025-11-07)
- Initial grid system implementation
- 8px baseline grid
- Calendar 7×6 grid with responsive behavior
- Roster 3-column grid with 20 visible rows
- Modular scale (1.25 ratio)
- Comprehensive utilities and documentation
