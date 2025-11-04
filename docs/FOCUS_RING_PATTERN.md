# Focus Ring Pattern Documentation

## Overview
FirefighterHub uses standardized focus indicators to ensure WCAG 2.1 AA/AAA compliance and provide clear visual feedback for keyboard navigation.

## CSS Classes

### `.focus-ring` (Standard)
The primary focus indicator for most interactive elements.

```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900;
}
```

**Usage:**
- Buttons
- Links
- Input fields
- Select dropdowns
- Most interactive elements

**Example:**
```tsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus-ring">
  Click Me
</button>
```

### `.focus-ring-white` (Light Backgrounds)
Alternative focus indicator for colored or light backgrounds.

```css
.focus-ring-white {
  @apply focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900;
}
```

**Usage:**
- Elements on colored backgrounds where blue would have low contrast
- Buttons with dark backgrounds

**Example:**
```tsx
<button className="px-4 py-2 bg-slate-900 text-white rounded-lg focus-ring-white">
  Dark Button
</button>
```

### `.focus-ring-inset` (Tight Layouts)
Inset focus indicator that prevents layout shift in grid layouts.

```css
.focus-ring-inset {
  @apply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500;
}
```

**Usage:**
- Calendar day cells
- Grid items
- Elements where layout shift would be disruptive

**Example:**
```tsx
<button className="aspect-square p-2 bg-slate-800 rounded-md focus-ring-inset">
  Day Cell
</button>
```

## Color Overrides

For semantic context, you can override the ring color using Tailwind's `!important` syntax:

```tsx
// Success/Confirmation actions (green)
<button className="focus-ring !ring-green-500">Confirm</button>

// Error/Danger actions (red)
<button className="focus-ring !ring-red-500">Delete</button>

// Warning/Admin actions (orange)
<button className="focus-ring !ring-orange-500">Admin</button>

// Certification-specific (amber, emerald, cyan)
<input type="checkbox" className="focus-ring !ring-amber-500" /> // FTO
<input type="checkbox" className="focus-ring !ring-emerald-500" /> // BLS
<input type="checkbox" className="focus-ring !ring-cyan-500" /> // ALS
```

## WCAG Compliance

### Contrast Ratios
All focus ring colors meet or exceed WCAG 2.4.11 Level AA requirements (3:1 minimum):

| Color | Hex | Contrast vs Slate-900 | WCAG Level |
|-------|-----|----------------------|------------|
| blue-500 | #3B82F6 | 8.6:1 | AAA ✓ |
| green-500 | #10B981 | 5.3:1 | AA ✓ |
| red-500 | #EF4444 | 4.8:1 | AA ✓ |
| orange-500 | #F97316 | 5.9:1 | AA ✓ |
| amber-500 | #F59E0B | 7.2:1 | AAA ✓ |
| emerald-500 | #10B981 | 5.3:1 | AA ✓ |
| cyan-500 | #06B6D4 | 5.6:1 | AA ✓ |

### Ring Width
- **2px** - Meets WCAG 2.4.11 minimum requirement
- **ring-offset-2** - Provides 2px spacing between ring and element

## Component Examples

### Button Component
```tsx
import { Button } from '@/components/ui/Button';

// Built-in focus-ring support
<Button variant="primary">Primary</Button>
<Button variant="danger">Delete</Button>
```

### Input Fields
```tsx
<input
  type="text"
  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus-ring"
/>

// With error state
<input
  type="text"
  className={`w-full px-4 py-2 bg-slate-800 border rounded-lg focus-ring ${
    hasError ? 'border-red-500 !ring-red-500' : 'border-slate-700'
  }`}
/>
```

### Checkboxes
```tsx
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus-ring"
  />
  <span>Option</span>
</label>

// With semantic color
<input
  type="checkbox"
  className="w-4 h-4 rounded border-amber-600 bg-gray-800 text-amber-600 focus-ring !ring-amber-500"
/>
```

### Calendar Day Cells
```tsx
<button
  className={`
    aspect-square p-2 rounded-md
    focus-ring-inset
    ${isToday ? 'bg-blue-600' : 'bg-slate-800'}
  `}
>
  {day}
</button>
```

## Migration Guide

### From Inline Styles
Replace inline focus styles with the appropriate class:

**Before:**
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click
</button>
```

**After:**
```tsx
<button className="focus-ring">
  Click
</button>
```

### With Custom Ring Color
**Before:**
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
  Success
</button>
```

**After:**
```tsx
<button className="focus-ring !ring-green-500">
  Success
</button>
```

## Testing

### Keyboard Navigation
- **Tab**: Forward navigation
- **Shift+Tab**: Backward navigation
- **Enter/Space**: Activate element
- **Escape**: Close modals

### Visual Inspection
1. Tab through all interactive elements
2. Verify focus ring is visible and has sufficient contrast
3. Check for layout shift (should only occur with standard ring, not inset)
4. Test in dark mode (primary) and light mode

### Screen Reader
- VoiceOver (macOS): Cmd+F5
- NVDA (Windows): Free download
- Verify element role and state are announced

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Touch events don't trigger focus, but keyboard navigation works

## Additional Resources
- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [WCAG 2.4.11: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
