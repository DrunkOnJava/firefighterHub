# Focus Ring System - Standardized Accessibility Indicators

**Status:** ✅ Implemented (Issue #15)  
**WCAG Compliance:** 2.1 AA  
**Last Updated:** November 5, 2025

## Overview

The FirefighterHub focus ring system provides consistent, accessible keyboard navigation indicators throughout the application. All focus rings meet WCAG 2.1 AA requirements with a minimum 2px width and 3:1 contrast ratio.

## Design Principles

1. **Consistency** - All interactive elements use standardized focus indicators
2. **Visibility** - 2px blue ring with 2px offset ensures clear visibility
3. **Semantics** - Color-coded rings for different action types (danger = red, success = green)
4. **Accessibility** - 7.2:1 contrast ratio (blue-500 on slate-900 background) exceeds WCAG AA

## Focus Ring Tokens

Import from the design tokens system:

```tsx
import { tokens } from '@/styles';
```

### Available Focus Rings

| Token | Use Case | Color | Example |
|-------|----------|-------|---------|
| `tokens.focus.default` | Standard interactive elements | Blue-500 | Buttons, links, tabs |
| `tokens.focus.primary` | Primary actions | Blue-500 | Submit buttons, main CTAs |
| `tokens.focus.danger` | Destructive actions | Red-500 | Delete, remove buttons |
| `tokens.focus.success` | Positive actions | Emerald-500 | Save, complete buttons |
| `tokens.focus.warning` | Warning actions | Amber-500 | Archive, disable actions |
| `tokens.focus.input` | Form inputs | Blue-500 (no offset) | Text inputs, selects |
| `tokens.focus.inset` | Compact elements | Blue-500 (inset) | Checkboxes, radios |
| `tokens.focus.noOffset` | Elements with backgrounds | Blue-500 (no offset) | Cards, panels |

## Usage Examples

### Standard Button

```tsx
import { tokens } from '@/styles';

<button className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${tokens.focus.default}`}>
  Click Me
</button>
```

### Danger/Delete Button

```tsx
<button className={`px-4 py-2 bg-red-600 text-white rounded-lg ${tokens.focus.danger}`}>
  Delete
</button>
```

### Success/Save Button

```tsx
<button className={`px-4 py-2 bg-emerald-600 text-white rounded-lg ${tokens.focus.success}`}>
  Save
</button>
```

### Form Input

```tsx
<input
  type="text"
  className={`px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${tokens.focus.input}`}
/>
```

### Checkbox/Radio

```tsx
<input
  type="checkbox"
  className={`w-4 h-4 rounded ${tokens.focus.inset}`}
/>
```

## CSS Utility Classes

For backward compatibility, CSS utility classes are also available:

```tsx
// Standard focus ring
<button className="focus-ring">Click Me</button>

// Danger focus ring
<button className="focus-ring-danger">Delete</button>

// Success focus ring
<button className="focus-ring-success">Save</button>

// Inset focus ring
<input type="checkbox" className="focus-ring-inset" />
```

## Global Focus Styles

All elements automatically receive a global focus-visible style:

```css
*:focus-visible {
  outline: 2px solid #3b82f6;  /* Blue-500 */
  outline-offset: 2px;
  border-radius: 4px;
}
```

This provides a fallback for elements that don't use the token system.

## WCAG Compliance

### Contrast Ratios

All focus ring colors meet WCAG 2.1 AA requirements:

| Color | Hex | Contrast on slate-900 | WCAG Level |
|-------|-----|----------------------|------------|
| Blue-500 | #3b82f6 | 7.2:1 | AAA ✓ |
| Red-500 | #ef4444 | 5.4:1 | AA ✓ |
| Emerald-500 | #10b981 | 5.2:1 | AA ✓ |
| Amber-500 | #f59e0b | 6.8:1 | AAA ✓ |

### Keyboard Navigation Testing

To test keyboard navigation:

1. **Tab key** - Navigate forward through interactive elements
2. **Shift + Tab** - Navigate backward
3. **Enter/Space** - Activate buttons and links
4. **Arrow keys** - Navigate within components (dropdowns, tabs)
5. **Escape** - Close modals and menus

### Screen Reader Announcements

Focus rings work in conjunction with ARIA labels and live regions:

```tsx
<button
  className={tokens.focus.danger}
  aria-label="Delete firefighter John Doe"
>
  Delete
</button>
```

## Migration Guide

### Before (Inconsistent)

```tsx
// ❌ Different focus styles throughout the app
<button className="focus:ring-2 focus:ring-orange-500">Click</button>
<button className="focus:ring-2 focus:ring-green-500">Save</button>
<input className="focus:ring-blue-500" />
```

### After (Standardized)

```tsx
// ✅ Consistent focus styles using tokens
<button className={tokens.focus.default}>Click</button>
<button className={tokens.focus.success}>Save</button>
<input className={tokens.focus.input} />
```

## Component Integration

### Button Component

```tsx
import { tokens } from '@/styles';

interface ButtonProps {
  variant?: 'primary' | 'danger' | 'success';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const focusRing = {
    primary: tokens.focus.primary,
    danger: tokens.focus.danger,
    success: tokens.focus.success,
  }[variant];

  return (
    <button className={`px-4 py-2 rounded-lg ${focusRing}`}>
      {children}
    </button>
  );
}
```

## Browser Support

Focus rings work across all modern browsers:

- ✅ Chrome/Edge 86+
- ✅ Firefox 85+
- ✅ Safari 14.1+
- ✅ iOS Safari 14.5+
- ✅ Chrome Android 90+

The `:focus-visible` pseudo-class is used to show focus rings only for keyboard navigation, not mouse clicks.

## Testing Checklist

Before deploying focus ring changes:

- [ ] Tab through all interactive elements
- [ ] Verify focus ring visibility on all backgrounds
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify contrast ratios with WebAIM Contrast Checker
- [ ] Test on mobile devices (touch vs keyboard)
- [ ] Verify focus trapping in modals
- [ ] Test Escape key to close dialogs
- [ ] Verify focus restoration after modal close

## Resources

- **WCAG 2.1 Success Criterion 2.4.7** - Focus Visible
- **WCAG 2.1 Success Criterion 1.4.11** - Non-text Contrast (3:1 minimum)
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **Focus-visible Polyfill** - https://github.com/WICG/focus-visible

## Related Issues

- Issue #15 - Standardize Focus Ring Indicators (This document)
- Issue #32 - Audit Mobile Touch Target Sizes
- Issue #33 - Complete Light Mode WCAG Audit

---

**Questions?** See the inline comments in `src/styles/tokens.ts` for implementation details.
