# Responsive Design Strategy

## Overview

This document defines the responsive design strategy for FirefighterHub, ensuring consistent breakpoint usage across all components and providing clear guidelines for implementing responsive layouts.

## Design Philosophy

FirefighterHub uses a **mobile-first, progressive enhancement** approach:

1. **Mobile-first** - Base styles target mobile devices (< 640px)
2. **Tablet optimization** - Enhanced layouts for tablets (640px - 1023px) 
3. **Desktop refinement** - Full-featured experience for desktop (≥ 1024px)

### Key Principles

- **Simplicity First** - Use only `sm:` and `lg:` breakpoints for most components
- **Consistency** - Apply breakpoints uniformly across similar UI patterns
- **Touch-Friendly** - Maintain 44px minimum touch targets on mobile
- **Content Priority** - Progressive disclosure of secondary information

## Breakpoint System

### Tailwind Breakpoints (Default)

```typescript
export const TAILWIND_BREAKPOINTS = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X extra large devices
} as const;
```

### FirefighterHub Strategy

**Use only `sm:` and `lg:` for most components** to reduce complexity and maintain consistency.

```typescript
export const RESPONSIVE_STRATEGY = {
  /**
   * Mobile - Base styles (no prefix)
   * Target: < 640px
   * Devices: Mobile phones (portrait/landscape)
   */
  MOBILE: '< 640px',
  
  /**
   * Tablet - Small breakpoint (sm: prefix)
   * Target: 640px - 1023px
   * Devices: Tablets, large phones (landscape)
   */
  TABLET: '640px-1023px',
  
  /**
   * Desktop - Large breakpoint (lg: prefix)
   * Target: ≥ 1024px
   * Devices: Desktop computers, large tablets
   */
  DESKTOP: '≥ 1024px',
  
  /**
   * Component-Specific Breakpoints
   * 
   * Use these specialized breakpoints only when component
   * behavior requires finer control.
   */
  COMPONENT_BREAKPOINTS: {
    /**
     * Sidebar collapse point
     * Below xl, sidebar is hidden and accessible via mobile menu
     */
    SIDEBAR_COLLAPSE: 'xl', // 1280px
    
    /**
     * Navigation mobile mode
     * Below lg, header switches to mobile layout with hamburger menu
     */
    NAV_MOBILE: 'lg', // 1024px
    
    /**
     * Calendar compact mode
     * Below sm, calendar shows abbreviated day names and compact cells
     */
    CALENDAR_COMPACT: 'sm', // 640px
    
    /**
     * Modal responsive padding
     * md: used only for modal padding adjustments
     */
    MODAL_PADDING: 'md', // 768px
    
    /**
     * Grid column adjustments
     * md: used for form grids (1 col → 2 cols → 3+ cols)
     */
    GRID_COLUMNS: 'md', // 768px
  },
} as const;
```

## Implementation Patterns

### Pattern 1: Text Visibility (Show/Hide)

**Use Case:** Toggle text labels based on screen size

```tsx
// ✅ CORRECT - Use sm: for mobile-tablet transition
<button>
  <Icon />
  <span className="hidden sm:inline">Label Text</span>
</button>

// Examples from codebase:
// - Header.tsx: "Add Member" button
// - Sidebar.tsx: "Reports" link
// - CalendarGrid.tsx: Weekday names (full vs abbreviated)
```

### Pattern 2: Layout Direction (Flex/Stack)

**Use Case:** Stack on mobile, horizontal on larger screens

```tsx
// ✅ CORRECT - Use lg: for tablet-desktop transition
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  <div>Primary content</div>
  <div>Secondary content</div>
</div>

// Example from ListView.tsx
```

### Pattern 3: Grid Columns (Responsive Grid)

**Use Case:** Adjust grid columns based on screen size

```tsx
// ✅ CORRECT - Use md: for progressive column expansion
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <GridItem key={item.id} {...item} />)}
</div>

// Progression: Mobile (1 col) → Tablet (2 cols) → Desktop (3 cols)
// Used in: FirefightersModal.tsx, QuickAddFirefighterModal.tsx
```

### Pattern 4: Typography Scaling

**Use Case:** Increase font size for better readability on larger screens

```tsx
// ✅ CORRECT - Use sm: and lg: for progressive scaling
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Page Title
</h1>

// Progression: Mobile (24px) → Tablet (30px) → Desktop (36px)
// Defined in tokens.ts: typography.heading.h1
```

### Pattern 5: Spacing Adjustments

**Use Case:** Increase spacing on larger screens for better visual hierarchy

```tsx
// ✅ CORRECT - Use sm: prefix for spacing progression
<div className="px-4 sm:px-6 py-3 sm:py-4">
  Content with progressive padding
</div>

// Example from Header.tsx
```

### Pattern 6: Component Visibility (Mobile Menu)

**Use Case:** Show/hide entire components based on layout

```tsx
// ✅ CORRECT - Use lg: for desktop-specific visibility
<div className="hidden lg:flex items-center gap-3">
  <DesktopOnlyFeature />
</div>

<div className="lg:hidden">
  <MobileOnlyFeature />
</div>

// Example from Header.tsx
```

## Component-Specific Guidelines

### Calendar Components

**Target:** Optimized for tablets (primary use case for shift scheduling)

```tsx
// CalendarGrid.tsx
<span className="hidden sm:inline">{fullDayName}</span>  // Sunday
<span className="sm:hidden">{shortDayName}</span>         // Sun

// Calendar container padding
className="p-4 sm:p-5 lg:p-6"  // Progressive padding
```

**Breakpoint Strategy:**
- Mobile (< 640px): Abbreviated days, compact cells, minimal padding
- Tablet (640px+): Full day names, standard cells, comfortable padding  
- Desktop (1024px+): Enhanced spacing, additional features

### Header Component

**Target:** Responsive navigation across all screen sizes

```tsx
// Header.tsx
<div className="hidden lg:flex items-center gap-3">
  {/* Desktop navigation */}
</div>

<div className="lg:hidden">
  <button onClick={onOpenMobileMenu}>
    <Menu />  {/* Hamburger menu */}
  </button>
</div>

// Button labels
<span className="hidden md:inline">Add Member</span>
```

**Breakpoint Strategy:**
- Mobile (< 1024px): Hamburger menu, icon-only buttons
- Desktop (1024px+): Full navigation, labeled buttons

### Sidebar Component

**Target:** Collapsible sidebar for space efficiency

```tsx
// Sidebar.tsx - Not currently implemented but planned
// FUTURE: Sidebar visible only on xl: screens (≥ 1280px)
<aside className="hidden xl:block w-64">
  {/* Sidebar content */}
</aside>
```

**Breakpoint Strategy:**
- Mobile/Tablet (< 1280px): Hidden, accessible via mobile menu
- Desktop XL (1280px+): Persistent sidebar

### Modal Components

**Target:** Responsive dialog sizing and padding

```tsx
// Modal containers
<div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
  <div className="p-5 sm:p-6">
    {/* Modal content */}
  </div>
</div>
```

**Breakpoint Strategy:**
- Mobile: Full-width (with margins), compact padding
- Tablet: Medium max-width (512px), standard padding
- Desktop: Large max-width (672px), generous padding

### Form Layouts

**Target:** Progressive grid expansion for better scanability

```tsx
// Form grids
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField label="Name" />
  <FormField label="Station" />
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <CertCheckbox label="Engine" />
  <CertCheckbox label="Truck" />
  <CertCheckbox label="Rescue" />
  <CertCheckbox label="Brush" />
</div>
```

**Breakpoint Strategy:**
- Mobile: Single column (easier scrolling)
- Tablet+: Multi-column (better scanability)

### Button Components

**Target:** Size-appropriate buttons with optional labels

```tsx
// Button.tsx size variants
const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-md gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
}

// Responsive label visibility
<Button size="md">
  <Icon />
  <span className="hidden sm:inline">Action</span>
</Button>
```

## Testing Checklist

Test all components at these critical breakpoints:

### Breakpoint Test Targets

```typescript
export const TEST_BREAKPOINTS = {
  MOBILE_PORTRAIT: 375,   // iPhone SE, small phones
  MOBILE_LANDSCAPE: 667,  // iPhone SE landscape
  TABLET_PORTRAIT: 768,   // iPad portrait
  TABLET_LANDSCAPE: 1024, // iPad landscape
  DESKTOP_SMALL: 1280,    // Laptop
  DESKTOP_LARGE: 1920,    // Full HD desktop
} as const;
```

### Visual Regression Tests

For each breakpoint, verify:

- [ ] **Layout integrity** - No overflow, broken grids, or overlapping content
- [ ] **Touch targets** - Minimum 44px height/width on mobile
- [ ] **Text readability** - Font sizes appropriate for screen size
- [ ] **Navigation** - Mobile menu works, desktop nav displays correctly
- [ ] **Spacing** - Padding/margins feel comfortable, not cramped
- [ ] **Images/icons** - Scale proportionally, no distortion
- [ ] **Modals/dialogs** - Fit screen with appropriate margins
- [ ] **Forms** - Input fields accessible, labels visible

## Common Mistakes to Avoid

### ❌ Mistake 1: Overusing Breakpoints

```tsx
// ❌ WRONG - Too many breakpoints, hard to maintain
<div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8">
  Content
</div>

// ✅ CORRECT - Simple, maintainable
<div className="p-4 lg:p-6">
  Content
</div>
```

### ❌ Mistake 2: Inconsistent Breakpoint Usage

```tsx
// ❌ WRONG - Component A uses sm:, Component B uses md: for same pattern
// ComponentA.tsx
<span className="hidden sm:inline">Label</span>

// ComponentB.tsx
<span className="hidden md:inline">Label</span>  // Inconsistent!

// ✅ CORRECT - Use same breakpoint for same pattern
// Both components
<span className="hidden sm:inline">Label</span>
```

### ❌ Mistake 3: Desktop-First Thinking

```tsx
// ❌ WRONG - Desktop styles as base, mobile as override
<div className="flex-row md:flex-col">  // Backwards!
  Content
</div>

// ✅ CORRECT - Mobile-first, desktop as enhancement
<div className="flex-col md:flex-row">
  Content
</div>
```

### ❌ Mistake 4: Arbitrary Breakpoint Values

```tsx
// ❌ WRONG - Custom breakpoint values not in design system
<div className="min-w-[900px] max-w-[1440px]">
  Content
</div>

// ✅ CORRECT - Use Tailwind breakpoints
<div className="lg:max-w-screen-lg xl:max-w-screen-xl">
  Content
</div>
```

### ❌ Mistake 5: Forgetting Touch Targets

```tsx
// ❌ WRONG - Too small for mobile touch
<button className="px-2 py-1 text-xs">
  Tap Me
</button>

// ✅ CORRECT - Meets WCAG 2.1 AA (44px minimum)
<button className="px-4 py-3 text-sm min-h-[44px]">
  Tap Me
</button>
```

## Browser DevTools Testing

### Chrome DevTools Device Emulation

1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test these presets:
   - iPhone SE (375 x 667)
   - iPad (768 x 1024)
   - iPad Pro (1024 x 1366)
   - Desktop (1920 x 1080)

### Responsive Design Mode (Firefox)

1. Open DevTools (F12)
2. Click "Responsive Design Mode" (Ctrl+Shift+M)
3. Drag viewport to test fluid layouts
4. Check breakpoint transitions

### Manual Resize Testing

1. Start with small window (400px width)
2. Gradually expand width
3. Note each breakpoint transition:
   - 640px (sm:) - Tablet mode
   - 1024px (lg:) - Desktop mode
   - 1280px (xl:) - Desktop XL mode
4. Verify smooth transitions, no layout shifts

## Performance Considerations

### Mobile-First Benefits

- **Faster initial load** - Base styles smaller, enhancements loaded conditionally
- **Progressive enhancement** - Core functionality works on all devices
- **Bandwidth efficiency** - Mobile users don't download desktop-only CSS

### Responsive Images

```tsx
// ✅ Use responsive image loading
<img 
  src="/image-mobile.jpg"
  srcSet="/image-mobile.jpg 375w, /image-tablet.jpg 768w, /image-desktop.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
/>
```

### Conditional Rendering

```tsx
// ⚠️ Use with caution - CSS hiding is often better for performance
const isMobile = useMediaQuery('(max-width: 640px)');

// ✅ PREFER CSS hiding (avoids JS calculation)
<div className="hidden lg:block">Desktop only</div>

// ⚠️ OK for heavy components that shouldn't render at all
{!isMobile && <ExpensiveComponent />}
```

## Future Enhancements

### Planned Improvements

1. **Container Queries** - Once browser support improves (currently 90%+)
   ```css
   @container (min-width: 400px) {
     .card { padding: 2rem; }
   }
   ```

2. **Fluid Typography** - CSS clamp() for smoother scaling
   ```css
   font-size: clamp(1rem, 2.5vw, 2rem);
   ```

3. **Responsive Hooks** - Custom React hooks for breakpoint detection
   ```typescript
   const { isMobile, isTablet, isDesktop } = useBreakpoint();
   ```

4. **Touch Gesture Support** - Swipe navigation for calendar
   ```typescript
   useSwipeGesture({ onSwipeLeft: nextMonth, onSwipeRight: prevMonth });
   ```

## Resources

### Internal Documentation

- [Design Tokens](../src/styles/tokens.ts) - Typography, spacing, borders
- [Color System](../src/styles/colorSystem.ts) - Color tokens
- [UI/UX Implementation Guide](./UI_UX_IMPLEMENTATION_GUIDE.md) - Design audit tasks
- [Accessibility Guide](./ACCESSIBILITY.md) - WCAG compliance

### External References

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Mobile-First Design Principles](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)
- [Responsive Web Design Patterns](https://web.dev/patterns/layout/)

## Quick Reference Card

```typescript
// Copy this snippet for quick reference while coding

/**
 * RESPONSIVE BREAKPOINT CHEAT SHEET
 * 
 * USE THESE TWO FOR 95% OF CASES:
 * - sm: 640px  → Mobile to Tablet transition
 * - lg: 1024px → Tablet to Desktop transition
 * 
 * COMPONENT-SPECIFIC ONLY:
 * - md: 768px  → Form grids, modal padding
 * - xl: 1280px → Sidebar collapse point
 * 
 * COMMON PATTERNS:
 * 
 * Text visibility:     hidden sm:inline
 * Layout direction:    flex-col lg:flex-row
 * Grid columns:        grid-cols-1 md:grid-cols-2 lg:grid-cols-3
 * Typography:          text-2xl sm:text-3xl lg:text-4xl
 * Spacing:             px-4 sm:px-6 lg:px-8
 * Touch targets:       min-h-[44px] (always on mobile)
 * 
 * TESTING TARGETS:
 * - 375px  (Mobile)
 * - 768px  (Tablet)
 * - 1024px (Desktop)
 * - 1920px (Full HD)
 */
```

---

**Last Updated:** 2025-11-05  
**Maintained By:** UI/UX Implementation Team  
**Related Issues:** #27 (Phase 4 - Responsive Design Documentation)
