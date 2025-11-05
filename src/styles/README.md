# Design System Documentation

This directory contains the FirefighterHub design token system - a single source of truth for all visual styling.

## 📁 File Structure

```
src/styles/
├── tokens.ts       # Spacing, typography, borders, shadows
├── colorSystem.ts  # Color palette with usage rules
├── index.ts        # Barrel export
└── README.md       # This file
```

## 🎯 Philosophy

**Problem**: Inconsistent padding, colors, and spacing across 46+ components.  
**Solution**: Centralized design tokens with clear usage guidelines.

**Benefits**:
- ✅ Single source of truth for visual design
- ✅ Easy to update globally (change once, apply everywhere)
- ✅ Type-safe and autocomplete-friendly
- ✅ Prevents ad-hoc styling decisions
- ✅ 30% reduction in excessive padding

## 🚀 Quick Start

### Import

```tsx
import { tokens, colors } from '@/styles';
```

### Basic Usage

```tsx
// Card with padding and border radius
<div className={`${colors.structural.bg.card} ${tokens.spacing.card.md} ${tokens.borders.radius.xl}`}>
  Content
</div>

// Primary button
<button className={colors.components.button.primary}>
  Click Me
</button>

// Typography
<h2 className={tokens.typography.heading.h2}>
  Section Title
</h2>
```

## 📏 Spacing Tokens

### Card Padding

Use for card containers:

```tsx
tokens.spacing.card.sm  // p-3  (12px)
tokens.spacing.card.md  // p-4  (16px) ← Most common
tokens.spacing.card.lg  // p-5  (20px)
tokens.spacing.card.xl  // p-6  (24px)
```

**Migration**:
- `p-6` → `${tokens.spacing.card.md}` (reduced from 24px to 16px)
- `p-5` → `${tokens.spacing.card.md}` (reduced from 20px to 16px)

### Modal Padding

Use for modal content:

```tsx
tokens.spacing.modal.sm  // p-4  (16px)
tokens.spacing.modal.md  // p-5  (20px) ← Most common
tokens.spacing.modal.lg  // p-6  (24px)
tokens.spacing.modal.xl  // p-8  (32px)
```

### Gap Between Items

Use for `gap-*` in flex/grid layouts:

```tsx
tokens.spacing.gap.sm  // gap-2  (8px)
tokens.spacing.gap.md  // gap-3  (12px) ← Most common
tokens.spacing.gap.lg  // gap-4  (16px)
tokens.spacing.gap.xl  // gap-6  (24px)
```

### Margins

Use for `mb-*` (margin-bottom):

```tsx
tokens.spacing.margin.sm  // mb-2  (8px)
tokens.spacing.margin.md  // mb-3  (12px)
tokens.spacing.margin.lg  // mb-4  (16px) ← Most common
tokens.spacing.margin.xl  // mb-6  (24px)
```

## 🎨 Color System

### Rule of Thumb

- **GRAY palette** → Structure (backgrounds, containers, borders)
- **SLATE palette** → Interaction (buttons, inputs, hover states)
- **SEMANTIC colors** → Meaning (red=danger, blue=scheduled, green=success)

### Structural Colors (Gray)

Use for non-interactive visual structure:

```tsx
// Backgrounds
colors.structural.bg.app       // Main app background
colors.structural.bg.card      // Card backgrounds
colors.structural.bg.overlay   // Modal overlay

// Borders
colors.structural.border.default  // Standard borders
colors.structural.border.emphasis // Emphasized borders

// Text
colors.structural.text.primary    // Main text (high contrast)
colors.structural.text.secondary  // Secondary text (medium contrast)
```

### Interactive Colors (Slate)

Use for clickable/focusable elements:

```tsx
// Buttons (non-primary)
colors.interactive.button.default  // Default button
colors.interactive.button.hover    // Button hover

// Inputs
colors.interactive.input.default   // Default input
colors.interactive.input.focus     // Focused input

// Hover states
colors.interactive.hover.bg        // Hover background
```

### Semantic Colors

Use when conveying meaning:

```tsx
// Primary actions (red gradient - firefighter theme)
colors.semantic.primary.gradient   // Primary button gradient
colors.semantic.primary.shadow     // Matching shadow

// Scheduled holds (blue)
colors.semantic.scheduled.gradient // Blue gradient
colors.semantic.scheduled.text     // Blue text

// Completed holds (emerald/green)
colors.semantic.success.gradient   // Green gradient
colors.semantic.success.text       // Green text

// Warnings (amber)
colors.semantic.warning.gradient   // Amber gradient
colors.semantic.warning.text       // Amber text

// Errors (red)
colors.semantic.error.gradient     // Red gradient
colors.semantic.error.text         // Red text
```

### Component Presets

Pre-configured combinations for common patterns:

```tsx
// Buttons
colors.components.button.primary   // Red gradient (primary action)
colors.components.button.secondary // Slate background (secondary)
colors.components.button.danger    // Red gradient (destructive)
colors.components.button.success   // Emerald gradient (success)
colors.components.button.ghost     // Transparent background

// Inputs
colors.components.input.default    // Standard input
colors.components.input.error      // Error state input

// Cards
colors.components.card.default     // Static card
colors.components.card.hover       // Interactive card
colors.components.card.elevated    // Elevated card with shadow

// Modal
colors.components.modal.background // Modal background
colors.components.modal.border     // Modal border
colors.components.modal.overlay    // Modal overlay
```

## 📐 Border Radius Hierarchy

A consistent border radius system creates visual hierarchy and helps users distinguish between element types.

### Hierarchy Rules

```tsx
// Small elements (badges, tags, pills) - 6px
tokens.borders.radius.md  // rounded-md

// Interactive elements (buttons, inputs, dropdowns) - 8px
tokens.borders.radius.lg  // rounded-lg

// Containers (cards, panels, sections) - 12px
tokens.borders.radius.xl  // rounded-xl

// Overlays (modals, dialogs, drawers) - 16px
tokens.borders.radius['2xl']  // rounded-2xl

// Circular elements (avatars, indicators) - 9999px
tokens.borders.radius.full  // rounded-full
```

### Usage Examples

```tsx
// Badge (small element)
<span className={`px-2 py-1 ${tokens.borders.radius.md} bg-blue-600 text-white`}>
  Shift A
</span>

// Button (interactive)
<button className={`px-4 py-2 ${tokens.borders.radius.lg} bg-red-600 text-white`}>
  Complete Hold
</button>

// Card (container)
<div className={`${tokens.spacing.card.md} ${tokens.borders.radius.xl} bg-slate-800`}>
  Card content
</div>

// Modal (overlay)
<div className={`${tokens.spacing.modal.md} ${tokens.borders.radius['2xl']} bg-slate-800`}>
  Modal content
</div>

// Avatar (circular)
<div className={`w-10 h-10 ${tokens.borders.radius.full} bg-red-600`}>
  JD
</div>
```

### Why This Matters

- **Visual Hierarchy**: Larger radius = higher in visual hierarchy (modals > cards > buttons > badges)
- **Consistency**: Users learn to recognize element types by their corner radius
- **Professional**: Consistent radius values avoid a "random" appearance
- **Accessibility**: Predictable patterns help users navigate the interface

### Migration Examples

```tsx
// ❌ BEFORE: Inconsistent
<div className="rounded-lg">  {/* Modal using button radius */}
<button className="rounded-xl"> {/* Button using card radius */}
<span className="rounded-lg">   {/* Badge using button radius */}

// ✅ AFTER: Consistent hierarchy
<div className={tokens.borders.radius['2xl']}>  {/* Modal: 16px */}
<button className={tokens.borders.radius.lg}>    {/* Button: 8px */}
<span className={tokens.borders.radius.md}>     {/* Badge: 6px */}
```

## 🔤 Typography

### Headings

```tsx
tokens.typography.heading.h1  // text-3xl font-bold
tokens.typography.heading.h2  // text-2xl font-semibold
tokens.typography.heading.h3  // text-xl font-semibold
tokens.typography.heading.h4  // text-lg font-semibold
```

### Body Text

```tsx
tokens.typography.body.primary    // text-base (16px)
tokens.typography.body.secondary  // text-sm (14px)
tokens.typography.body.small      // text-xs (12px)
```

## 📦 Migration Guide

### Before (Inconsistent)

```tsx
<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <button className="bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-6 py-3 rounded-lg">
    Action
  </button>
</div>
```

### After (With Tokens)

```tsx
<div className={`
  ${colors.structural.bg.card}
  ${colors.structural.border.default}
  ${tokens.spacing.card.md}
  ${tokens.borders.radius.xl}
  border
`}>
  <h2 className={`${tokens.typography.heading.h2} ${tokens.spacing.margin.lg}`}>
    Title
  </h2>
  <button className={`${colors.components.button.primary} px-6 py-3 ${tokens.borders.radius.lg}`}>
    Action
  </button>
</div>
```

## 🎯 Common Patterns

### Card Component

```tsx
<div className={`
  ${colors.structural.bg.card}
  ${colors.structural.border.default}
  ${tokens.spacing.card.md}
  ${tokens.borders.radius.xl}
  ${tokens.shadows.lg}
  border
`}>
  <h3 className={`${tokens.typography.heading.h3} ${tokens.spacing.margin.md}`}>
    Card Title
  </h3>
  <p className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>
    Card content goes here
  </p>
</div>
```

### Modal

```tsx
<div className={`
  ${colors.components.modal.background}
  ${colors.components.modal.border}
  ${colors.components.modal.shadow}
  ${tokens.spacing.modal.md}
  ${tokens.borders.radius.xl}
  border
`}>
  {/* Modal content */}
</div>

{/* Modal overlay */}
<div className={colors.components.modal.overlay} />
```

### Button Variants

```tsx
// Primary action
<button className={`${colors.components.button.primary} px-6 py-3 ${tokens.borders.radius.lg}`}>
  Save Changes
</button>

// Secondary action
<button className={`${colors.components.button.secondary} px-6 py-3 ${tokens.borders.radius.lg}`}>
  Cancel
</button>

// Danger/destructive
<button className={`${colors.components.button.danger} px-6 py-3 ${tokens.borders.radius.lg}`}>
  Delete
</button>
```

### Calendar Day Cell

```tsx
// Scheduled hold
<div className={`
  ${colors.components.dayCell.scheduled}
  ${tokens.spacing.section.sm}
  ${tokens.borders.radius.md}
`}>
  Hold Info
</div>

// Completed hold
<div className={`
  ${colors.components.dayCell.completed}
  ${tokens.spacing.section.sm}
  ${tokens.borders.radius.md}
`}>
  Hold Info
</div>

// Both scheduled and completed
<div className={`
  ${colors.components.dayCell.both}
  ${tokens.spacing.section.sm}
  ${tokens.borders.radius.md}
`}>
  Hold Info
</div>
```

## ⚠️ Common Mistakes

### ❌ Don't Mix Systems

```tsx
// BAD: Mixing tokens with hardcoded values
<div className={`${tokens.spacing.card.md} bg-gray-800 p-6`}>
  // Conflict: tokens.spacing.card.md (p-4) overridden by p-6
</div>
```

### ❌ Don't Use Slate for Structure

```tsx
// BAD: Using interactive slate for structural border
<div className="border border-slate-600">

// GOOD: Use gray for structural elements
<div className={`border ${colors.structural.border.default}`}>
```

### ❌ Don't Skip Semantic Colors

```tsx
// BAD: Using arbitrary blue for success
<button className="bg-blue-600">Success</button>

// GOOD: Use semantic success color
<button className={colors.components.button.success}>Success</button>
```

## 📊 Spacing Reductions

To improve information density, all padding values were reduced by ~30%:

| Old Value | New Token | Reduction |
|-----------|-----------|-----------|
| `p-6` (24px) | `tokens.spacing.card.md` (16px) | -33% |
| `p-5` (20px) | `tokens.spacing.card.md` (16px) | -20% |
| `p-4` (16px) | `tokens.spacing.section.md` (12px) | -25% |
| `p-3` (12px) | `tokens.spacing.section.sm` (8px) | -33% |

**Result**: Users see more content without scrolling, reducing clicks and improving UX.

## 🔄 Gradual Migration

You don't have to update everything at once:

1. **Phase 1**: Use tokens for new components
2. **Phase 2**: Update large components (Calendar, FirefighterList)
3. **Phase 3**: Update remaining components
4. **Phase 4**: Remove old theme files

## 📚 Related Files

- **Color Theme**: `src/utils/theme.ts` (legacy, will be replaced)
- **Calendar Theme**: `src/utils/calendarTheme.ts` (legacy, will be replaced)
- **Sidebar Theme**: `src/utils/sidebarTheme.ts` (legacy, will be replaced)

## 🎨 Accessibility

All colors meet WCAG 2.1 AA contrast requirements:

- `text-gray-100` on `bg-gray-800`: 10.4:1 (AAA)
- `text-gray-400` on `bg-gray-800`: 5.2:1 (AA)
- Button text on gradients: 4.8:1+ (AA)

## ❓ FAQ

**Q: Can I still use Tailwind classes directly?**  
A: Yes, but use tokens for spacing, colors, and typography. Direct Tailwind is okay for layout (`flex`, `grid`, etc.).

**Q: What if I need a one-off custom color?**  
A: Use Tailwind directly for truly unique cases, but document why in a comment.

**Q: Should I update old components?**  
A: Yes, but prioritize large/frequently-used components (Calendar, FirefighterList, modals).

**Q: How do I remember which palette to use?**  
A: **Structure = Gray**, **Interaction = Slate**, **Meaning = Semantic**.

## 📝 Next Steps

1. ✅ Design token system created
2. ⏳ Replace blocking `confirm()` dialogs
3. ⏳ Refactor Calendar component (apply tokens)
4. ⏳ Refactor FirefighterList component (apply tokens)
5. ⏳ Update remaining 29 components

---

**Questions?** Check this README or review examples in newly created components.

**Last Updated**: November 2, 2025  
**Maintained By**: Development Team

