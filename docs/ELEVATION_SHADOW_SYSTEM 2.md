# Elevation Shadow System

## Overview

FirefighterHub implements a systematic 5-level elevation shadow system to create clear visual hierarchy and depth perception across the application. This document explains the system and provides usage guidelines.

## Elevation Levels

### Level 0: None (`shadow-none`)
**Purpose**: Flat backgrounds, inline elements
**Usage**: Elements that should appear flush with their container
```tsx
// Example: Inline text, flat backgrounds
<div className={tokens.shadows.none}>Content</div>
```

### Level 1: Subtle (`shadow-sm`)
**Purpose**: Slightly elevated cards, main containers
**Usage**: Calendar container, main content cards
**Components**: 
- `Calendar.tsx` - Main calendar container
```tsx
<div className={tokens.shadows.sm}>
  Calendar Content
</div>
```

### Level 2: Floating (`shadow-md`)
**Purpose**: Floating panels, dropdowns
**Usage**: Sidebar, dropdown menus, navigation panels
**Components**:
- `Sidebar.tsx` - Sidebar panel
```tsx
<div className={tokens.shadows.md}>
  Sidebar Content
</div>
```

### Level 3: Primary Actions (`shadow-lg`)
**Purpose**: Interactive elements, sticky headers
**Usage**: Buttons, sticky headers, primary actions
**Components**:
- `Header.tsx` - Sticky header
- Buttons with `colors.components.button.shadow`
```tsx
<header className={tokens.shadows.lg}>
  Header Content
</header>
```

### Level 4: Tooltips (`shadow-xl`)
**Purpose**: Overlays, tooltips, popovers
**Usage**: Tooltip containers, popovers, smaller overlays
```tsx
<div className={tokens.shadows.xl}>
  Tooltip Content
</div>
```

### Level 5: Modals (`shadow-2xl`)
**Purpose**: Highest priority overlays
**Usage**: Modals, dialogs, toast notifications
**Components**:
- `DayModal.tsx` - Calendar day modal
- `FirefighterProfileModal.tsx` - Profile modal
- All modal components via `colors.components.modal.shadow`
```tsx
<div className={tokens.shadows['2xl']}>
  Modal Content
</div>
```

## Visual Hierarchy

The shadow system creates the following depth perception:

```
┌─────────────────────────────────────┐
│  Level 5: Modals (shadow-2xl)       │ ← Highest, strongest shadow
│    Floats above everything          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Level 4: Tooltips (shadow-xl)      │
│    Overlays and popovers            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Level 3: Header (shadow-lg)        │ ← Sticky header
│    Primary actions and buttons      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Level 2: Sidebar (shadow-md)       │ ← Floating panel
│    Dropdowns and navigation         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Level 1: Calendar (shadow-sm)      │ ← Card element
│    Main content cards               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Level 0: Background (shadow-none)  │ ← Base layer
└─────────────────────────────────────┘
```

## Implementation Guidelines

### When to Use Each Level

1. **Use shadow-sm** for:
   - Main content cards
   - Calendar containers
   - List containers
   - Any card-like element at the base content level

2. **Use shadow-md** for:
   - Sidebar panels
   - Dropdown menus
   - Floating navigation
   - Elements that float above content but aren't overlays

3. **Use shadow-lg** for:
   - Sticky headers
   - Primary action buttons (already in button component)
   - Elements that need strong presence but aren't overlays

4. **Use shadow-xl** for:
   - Tooltips
   - Popovers
   - Small overlay elements
   - Connection status indicators

5. **Use shadow-2xl** for:
   - Modal dialogs
   - Toast notifications
   - Full-screen overlays
   - Highest priority UI elements

### Using Design Tokens

Always prefer design tokens over hardcoded shadow classes:

```tsx
// ✅ CORRECT - Using design tokens
import { tokens } from '@/styles';
<div className={tokens.shadows.md}>Content</div>

// ✅ CORRECT - Using component colors
import { colors } from '@/styles';
<div className={colors.components.modal.shadow}>Modal</div>

// ❌ WRONG - Hardcoded shadow
<div className="shadow-lg">Content</div>
```

### Color System Integration

Modal shadows are pre-configured in the color system:

```typescript
// In src/styles/colorSystem.ts
modal: {
  background: "bg-[#3A4149]",
  border: "border border-[#252A32]",
  shadow: "shadow-2xl",  // ← Level 5
  overlay: "bg-black/75 backdrop-blur-sm",
}
```

Button shadows are also integrated:

```typescript
button: {
  shadow: "shadow-lg shadow-gray-900/50",  // ← Level 3
}
```

## Migration Guide

If you're updating existing components to use the elevation system:

1. **Identify the component's role**:
   - Is it a card? → shadow-sm
   - Is it floating? → shadow-md
   - Is it sticky/primary? → shadow-lg
   - Is it a tooltip? → shadow-xl
   - Is it a modal? → shadow-2xl

2. **Replace hardcoded shadows**:
   ```tsx
   // Before
   <div className="shadow-lg">
   
   // After
   <div className={tokens.shadows.md}>
   ```

3. **Use appropriate level**:
   - Don't over-elevate (e.g., don't use shadow-2xl for a card)
   - Don't under-elevate (e.g., don't use shadow-sm for a modal)
   - Follow the hierarchy consistently

## Benefits

1. **Consistent Depth Perception**: Users can immediately understand element hierarchy
2. **Better UX**: Clear visual separation between content layers
3. **Maintainability**: Centralized shadow definitions in design tokens
4. **Accessibility**: Visual hierarchy helps users navigate the interface
5. **Professional Polish**: Systematic approach creates cohesive design

## Examples

### Before and After

#### Calendar Container
```tsx
// Before: Too heavy shadow for a card
<div className="shadow-2xl">

// After: Appropriate card elevation
<div className={tokens.shadows.sm}>
```

#### Header
```tsx
// Before: No shadow, poor separation
<header className="border-b sticky top-0">

// After: Clear separation with shadow
<header className={`border-b sticky top-0 ${tokens.shadows.lg}`}>
```

#### Sidebar
```tsx
// Before: Too heavy for a floating panel
<div className={tokens.shadows.lg}>

// After: Appropriate floating elevation
<div className={tokens.shadows.md}>
```

#### Modal
```tsx
// Before: Under-elevated for an overlay
<div className={tokens.shadows.xl}>

// After: Proper modal elevation
<div className={tokens.shadows['2xl']}>
```

## Related Documentation

- [Design Tokens](../src/styles/tokens.ts) - Complete token system
- [Color System](../src/styles/colorSystem.ts) - Color definitions and semantic colors
- [Component Patterns](../src/styles/README.md) - Usage guidelines

## Issue Reference

This elevation system was implemented as part of:
- **Issue #26**: [Phase 3] Implement Elevation Shadow System
- **PR**: Elevation Shadow System Implementation

For questions or suggestions, please open an issue on GitHub.
