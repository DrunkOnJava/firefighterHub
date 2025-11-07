---
name: 🎨 UI/UX Improvement
about: Suggest improvements to the user interface or user experience
title: '[UI/UX] '
labels: ['ui/ux', 'enhancement', 'needs-triage']
assignees: ''
---

## Component/Screen

<!-- Which component or screen needs improvement? -->

**Affected Component:**
- [ ] Calendar view
- [ ] Firefighter roster
- [ ] Shift badge
- [ ] Modal dialogs
- [ ] Navigation
- [ ] Forms
- [ ] Buttons/actions
- [ ] Loading states
- [ ] Error messages
- [ ] Other: 

## Current Behavior

<!-- Describe the current state -->

## Proposed Improvement

<!-- Describe what you'd like to see -->

## User Impact

<!-- How does this affect users? -->

**Frequency:**
- [ ] Every use
- [ ] Multiple times per session
- [ ] Occasionally
- [ ] Rarely

**Impact:**
- [ ] 🔴 Critical - Makes feature hard to use
- [ ] 🟠 High - Significant UX improvement
- [ ] 🟡 Medium - Nice polish
- [ ] 🟢 Low - Minor enhancement

## Design System Alignment

<!-- How does this relate to the design system? -->

**Category:**
- [ ] Color/contrast
- [ ] Typography
- [ ] Spacing/layout
- [ ] Icons
- [ ] Shadows/elevation
- [ ] Border radius
- [ ] Focus indicators
- [ ] Loading states
- [ ] Transitions/animations
- [ ] Responsive design
- [ ] Dark mode

**Design Tokens:**
- [ ] Uses existing design tokens
- [ ] Requires new design tokens
- [ ] Updates to existing tokens needed

## WCAG Compliance

<!-- Does this address accessibility? -->

- [ ] 1.4.1 Use of Color (color-blind safe)
- [ ] 1.4.3 Contrast (minimum)
- [ ] 1.4.11 Non-text Contrast
- [ ] 2.4.7 Focus Visible
- [ ] 2.5.5 Target Size (44px minimum)
- [ ] Other WCAG criteria: 
- [ ] Not accessibility-related

**Current WCAG Level:**
- [ ] Non-compliant
- [ ] AA compliant
- [ ] AAA compliant

**Target WCAG Level:**
- [ ] AA
- [ ] AAA

## Visual Examples

<!-- Include screenshots, mockups, or examples -->

### Current State
<!-- Screenshot of current UI -->

### Proposed Design
<!-- Mockup or description of proposed UI -->

### Examples from Other Apps
<!-- Reference designs from other applications if helpful -->

## Implementation Details

### Technical Changes Needed

**Tailwind Classes:**
```tsx
// Current
<div className="...">

// Proposed
<div className="...">
```

**Component Changes:**
- File: 
- Changes: 

**New Components Needed:**
- [ ] Yes (describe): 
- [ ] No

### Responsive Breakpoints

- [ ] Mobile (375px): 
- [ ] Tablet (768px): 
- [ ] Desktop (1920px): 

### Dark Mode

- [ ] Light mode variant: 
- [ ] Dark mode variant: 
- [ ] Works in both modes already

## Testing Checklist

**Visual Testing:**
- [ ] Desktop (1920×1080)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Light mode
- [ ] Dark mode

**Accessibility Testing:**
- [ ] Keyboard navigation
- [ ] Screen reader (VoiceOver/NVDA)
- [ ] Focus indicators visible
- [ ] Touch targets ≥44px
- [ ] Color contrast verified

**Browser Testing:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Related Improvements

<!-- Are there related UI/UX issues that should be addressed together? -->

Should be done with:
- #
- #

Blocks:
- #

Depends on:
- #

## User Feedback

<!-- Has this been requested by users? Include quotes or links if applicable -->

## Metrics

<!-- How will we measure success? -->

**Expected Improvements:**
- Scan time: reduced by __%
- Task completion: improved by __%
- User satisfaction: 
- Error rate: reduced by __%

## Priority

<!-- Based on impact and frequency -->

- [ ] P0 - Critical UX issue
- [ ] P1 - High-impact improvement
- [ ] P2 - Medium-impact polish
- [ ] P3 - Nice-to-have enhancement

## Implementation Effort

- [ ] 🟢 Small (< 2 hours) - CSS/Tailwind changes only
- [ ] 🟡 Medium (2-4 hours) - Component changes
- [ ] 🟠 Large (1 day) - Multiple components or new patterns
- [ ] 🔴 Extra Large (2+ days) - Design system changes

## Design Review Needed

- [ ] Yes - Needs design review before implementation
- [ ] No - Can implement based on this description

## Additional Context

<!-- Any other context, references, or notes -->

---

## For Maintainers

<!-- This section will be filled by maintainers during triage -->

**UI/UX Phase:**
- [ ] Phase 1 - Critical (contrast, accessibility)
- [ ] Phase 2 - Visual Hierarchy
- [ ] Phase 3 - Component Consistency
- [ ] Phase 4 - Polish & Micro-interactions
- [ ] Phase 5 - Optimization & Performance

**Related Issues:**
- Part of UI/UX Audit: #37
- Related to: 

**Assignee:**
- [ ] Assign to developer
- [ ] Assign to @copilot with ui-ux-implementation-specialist
- [ ] Needs design review
