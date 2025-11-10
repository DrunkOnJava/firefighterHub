---
mode: 'agent'
tools: ['codebase', 'search', 'fetch']
description: 'Audit and fix WCAG 2.1 AA accessibility issues'
---

# Accessibility Audit

Audit and fix accessibility issues to meet WCAG 2.1 AA standards.

## Requirements

### Color Contrast
- Normal text: ≥4.5:1
- Large text (≥18px): ≥3:1
- UI components: ≥3:1

### Keyboard Navigation
- All interactive elements accessible via Tab
- Enter/Space activate buttons
- Escape closes modals

### Focus Indicators
- 2px outline
- 3:1 contrast ratio
- Visible on all interactive elements

### Touch Targets
- Minimum 44px height/width
- Adequate spacing between targets

### Screen Readers
- Proper ARIA labels
- Semantic HTML
- Announced state changes

## Tools

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools > Rendering > Emulate vision deficiencies
- axe DevTools extension

## Implementation

1. Use design tokens from `src/styles/colorSystem.ts`
2. Apply focus ring utilities: `.focus-ring` class
3. Add ARIA labels to icon buttons
4. Test with keyboard only
5. Verify with screen reader
