# Accessibility Guidelines for Firefighter Hub

## Overview
This application follows WCAG 2.1 Level AA standards to ensure accessibility for all users.

## Color Contrast Standards

### WCAG 2.1 Requirements
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

### Approved Colors for Dark Mode (gray-900 background)

#### Text Colors - WCAG AA Compliant ✓
```css
/* Primary text */
text-white           /* #FFFFFF - 21:1 contrast ✓✓✓ */

/* Secondary text */
text-gray-300        /* #D1D5DB - 8.59:1 contrast ✓✓ */
text-gray-accessible /* #D1D5DB - 8.59:1 contrast ✓✓ */

/* Tertiary text */
text-gray-400        /* #9CA3AF - 5.74:1 contrast ✓ */
text-gray-secondary  /* #9CA3AF - 5.74:1 contrast ✓ */

/* Status colors */
text-green-accessible  /* #86EFAC - 11.14:1 contrast ✓✓ */
text-blue-accessible   /* #93C5FD - 8.57:1 contrast ✓✓ */
text-red-accessible    /* #FCA5A5 - 7.35:1 contrast ✓✓ */
text-amber-accessible  /* #FCD34D - 12.04:1 contrast ✓✓ */
```

#### Colors to AVOID on Dark Backgrounds ✗
```css
/* These FAIL WCAG AA standards */
text-gray-500  /* #6B7280 - 3.32:1 contrast FAILS */
text-gray-600  /* #4B5563 - 2.39:1 contrast FAILS */
text-gray-700  /* #374151 - 1.82:1 contrast FAILS */
```

**Rule of Thumb**: On dark backgrounds (gray-900), never use gray-500 or darker for text.

## Touch Targets

### Minimum Size Requirements
- **All interactive elements**: Minimum 44x44px (WCAG 2.1 Level AAA)
- **Buttons, links, form controls**: Must meet this minimum
- **Calendar date cells**: Enhanced to 110px height on mobile for better UX

### Implementation
```css
/* Global rule applied in index.css */
button:not(:disabled), a {
  min-height: 44px;
  min-width: 44px;
}
```

## Keyboard Navigation

### Focus Indicators
- All focusable elements must have visible focus indicators
- Custom `.focus-ring` class provides consistent styling
- Default focus visible styling: 3px solid blue (#3B82F6)

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search bar |
| `Ctrl/Cmd + N` | Quick add firefighter (admin mode) |
| `Ctrl/Cmd + H` | Show help modal |
| `?` | Show keyboard shortcuts |
| `Escape` | Close modal |

## Screen Reader Support

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Landmark regions: `<main>`, `<nav>`, `<aside>`, `<header>`
- Skip to main content link provided

### ARIA Labels
- All buttons have descriptive labels or `aria-label` attributes
- Icon-only buttons include accessible text
- Dynamic content uses `aria-live` regions
- Modal dialogs use `aria-modal="true"` and proper focus management

### Example
```tsx
<button
  onClick={handleAction}
  aria-label="Close dialog"
>
  <X size={24} />
</button>
```

## Testing Checklist

### Automated Testing
- [ ] Run axe DevTools on all pages
- [ ] Use WAVE browser extension
- [ ] Lighthouse accessibility audit (aim for 95+)
- [ ] Check color contrast with browser dev tools

### Manual Testing
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Screen reader testing (VoiceOver on macOS, NVDA on Windows)
- [ ] Zoom to 200% (text must remain readable)
- [ ] Test with CSS disabled
- [ ] Test in high contrast mode (Windows)

### Mobile Testing
- [ ] Touch targets are at least 44x44px
- [ ] Pinch-to-zoom is not disabled
- [ ] Orientation changes work correctly
- [ ] Text is readable without zooming

## Common Fixes

### Low Contrast Text
```diff
- <p className="text-gray-500">Secondary text</p>
+ <p className="text-gray-400">Secondary text</p>
```

### Missing Focus Indicator
```diff
- <button className="bg-blue-600">Action</button>
+ <button className="bg-blue-600 focus-ring">Action</button>
```

### Small Touch Target
```diff
- <button className="p-1">
+ <button className="p-2 min-w-[44px] min-h-[44px]">
```

### Missing ARIA Label
```diff
- <button onClick={close}><X /></button>
+ <button onClick={close} aria-label="Close dialog"><X /></button>
```

## Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for automated accessibility testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) - Desktop tool for checking contrast ratios
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/) - Web accessibility resources

## Continuous Monitoring

1. **Pre-commit hook**: Run accessibility linter
2. **CI/CD pipeline**: Automated Lighthouse checks
3. **Quarterly audits**: Manual accessibility review
4. **User feedback**: Monitor accessibility-related issues

## Contact

For accessibility concerns or questions, please:
- Open an issue with label `accessibility`
- Reference WCAG 2.1 guidelines
- Include screenshots and steps to reproduce
- Suggest solutions when possible

---

*Last updated: 2025-01-31*
*WCAG 2.1 Level AA Compliance*
