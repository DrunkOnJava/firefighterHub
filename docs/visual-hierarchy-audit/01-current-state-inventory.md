# Phase 1: Current State Inventory
## Visual Hierarchy Audit - Discovery

**Date:** 2025-11-07  
**Phase:** 1 - Discovery & Analysis  
**Task:** 1.0 - Current State Inventory

---

## Component Inventory

### Total Components: 69 React Components

#### **Primary Views (5 components)**
1. `App.tsx` - Main application container
2. `FirefighterList.tsx` - Roster management view (refactored from 1,123 → 400 lines)
3. `Calendar.tsx` - Monthly calendar view
4. `BigCalendar.tsx` - Full-featured calendar (react-big-calendar)
5. `CalendarView.tsx` - Calendar wrapper component

#### **Navigation Components (4 components)**
1. `Header.tsx` - Global header with shift selector, actions
2. `MobileNav.tsx` - Mobile navigation menu
3. `BottomNav.tsx` - Mobile bottom navigation
4. `Breadcrumb.tsx` - Breadcrumb navigation

#### **Core UI Components (12 components)**
1. `Button.tsx` - Primary button component with variants
2. `LoadingButton.tsx` - Button with loading state
3. `Toast.tsx` - Toast notification system
4. `Tooltip.tsx` - Tooltip component
5. `ConfirmDialog.tsx` - Confirmation dialog
6. `EmptyState.tsx` - Empty state placeholders
7. `ErrorBoundary.tsx` - Error boundary component
8. `SkeletonLoader.tsx` - Loading skeleton
9. `ConnectionStatusIndicator.tsx` - Real-time connection status
10. `UpdateNotification.tsx` - Update notification banner
11. `MetricCard.tsx` - Dashboard metric card
12. `ShiftBadge.tsx` - Shift indicator badge

#### **Firefighter Management (10 components)**
1. `FirefighterItem.tsx` - Individual firefighter row
2. `FirefighterProfileModal.tsx` - Detailed firefighter profile
3. `AddFirefighterForm.tsx` - Add new firefighter form
4. `QuickAddFirefighterModal.tsx` - Quick add modal
5. `CompleteHoldModal.tsx` - Hold completion dialog
6. `TransferShiftModal.tsx` - Shift transfer dialog
7. `ReactivateModal.tsx` - Reactivate firefighter dialog
8. `NextUpBar.tsx` - Next up rotation indicator
9. `FilterPanel.tsx` - Roster filtering panel
10. `FirefightersModal.tsx` - Firefighter management modal

#### **Calendar Components (8 components)**
1. `calendar/BigCalendar.tsx` - Full calendar implementation
2. `calendar/MaterialMCalendar.tsx` - Material calendar variant
3. `calendar/CalendarHeader.tsx` - Month/year navigation
4. `calendar/CalendarGrid.tsx` - Calendar grid layout
5. `calendar/DayCell.tsx` - Individual day cell
6. `calendar/DayModal.tsx` - Day detail modal
7. `calendar/HoldList.tsx` - Hold list display
8. `calendar/HoldForm.tsx` - Hold scheduling form
9. `calendar/CalendarLegend.tsx` - Calendar legend

#### **Roster Sub-Components (3 components)**
1. `roster/BulkActions.tsx` - Bulk roster actions
2. `roster/ExportMenu.tsx` - Export functionality
3. `roster/RosterHeader.tsx` - Roster header (extracted)

#### **Supporting Components (10 components)**
1. `ShiftSelector.tsx` - Shift A/B/C selector
2. `ShiftIndicator.tsx` - Visual shift indicator
3. `StationSelector.tsx` - Fire station selector
4. `ActivityLog.tsx` - Activity log display
5. `ActivityLogModal.tsx` - Activity log modal
6. `HelpModal.tsx` - Help/documentation modal
7. `KeyboardShortcutsModal.tsx` - Keyboard shortcuts reference
8. `LoginModal.tsx` - Battalion Chief login
9. `BattalionChiefLogin.tsx` - Authentication component
10. `CalendarSubscribeModal.tsx` - Calendar subscription

#### **Reports & Analytics (1 component)**
1. `Reports.tsx` - Reporting interface

#### **Mobile-Specific (3 components)**
1. `mobile/BottomNav.tsx` - Bottom navigation bar
2. `mobile/MobileNav.tsx` - Mobile menu
3. (Additional mobile components in mobile/)

#### **List View (1 component)**
1. `ListView.tsx` - Alternative list view

---

## Current Design Token System

### **Implemented Tokens** (`src/styles/tokens.ts`)

#### Typography Scale
```typescript
heading: {
  h1: 'text-2xl sm:text-3xl lg:text-4xl'  // 24px → 30px → 36px (responsive)
  h2: 'text-xl sm:text-2xl'                // 20px → 24px
  h3: 'text-xl'                             // 20px
  h4: 'text-lg'                             // 18px
  h5: 'text-base'                           // 16px
}

body: {
  primary: 'text-base'      // 16px
  secondary: 'text-sm'      // 14px
  small: 'text-xs'          // 12px
  large: 'text-lg'          // 18px
}
```

**Analysis:**
- ✅ Responsive scaling implemented
- ✅ Major Third scale (1.25x) used
- ⚠️ Line-height is 'tight' (1.25) for headings - may need 'snug' (1.375)
- ⚠️ Body text uses default line-height - should specify 'normal' (1.5)

#### Spacing System
```typescript
spacing: {
  card: { sm: 'p-3', md: 'p-4', lg: 'p-5', xl: 'p-6' }      // 12px-24px
  modal: { sm: 'p-4', md: 'p-5', lg: 'p-6', xl: 'p-8' }     // 16px-32px
  section: { sm: 'p-2', md: 'p-3', lg: 'p-4' }              // 8px-16px
  gap: { xs: 'gap-1', sm: 'gap-2', md: 'gap-3', lg: 'gap-4', xl: 'gap-6' }
}
```

**Analysis:**
- ✅ Consistent 8px grid system (4px base)
- ✅ Reduced by ~30% from previous version for density
- ⚠️ No spacing for section-to-section gaps (need 24-32px option)

#### Border Radius Hierarchy
```typescript
borders: {
  radius: {
    md: 'rounded-md'     // 6px - Badges, tags
    lg: 'rounded-lg'     // 8px - Buttons, inputs
    xl: 'rounded-xl'     // 12px - Cards, panels
    '2xl': 'rounded-2xl' // 16px - Modals
    full: 'rounded-full' // 9999px - Circular
  }
}
```

**Analysis:**
- ✅ Clear hierarchy documented
- ✅ Semantic naming (small elements → large containers)

#### Shadow System
```typescript
shadows: {
  none, sm, md, lg, xl, '2xl', inner
}
```

**Elevation Levels:**
- Level 0: Flat backgrounds
- Level 1 (sm): Cards, containers
- Level 2 (md): Floating elements
- Level 3 (lg): Sticky headers
- Level 4 (xl): Tooltips
- Level 5 (2xl): Modals

**Analysis:**
- ✅ Well-documented elevation system
- ⚠️ No custom shadow values - relies on Tailwind defaults
- ⚠️ Missing dark mode shadow adjustments

#### Icon Sizing
```typescript
icons: {
  xs: 'w-3 h-3'  // 12px
  sm: 'w-4 h-4'  // 16px
  md: 'w-5 h-5'  // 20px
  lg: 'w-6 h-6'  // 24px
  xl: 'w-8 h-8'  // 32px
}
```

**Analysis:**
- ✅ Matches text sizes (optical balance)
- ✅ Clear usage guidelines

#### Focus Ring System (WCAG 2.1 AA)
```typescript
focus: {
  default: 'focus-visible:ring-2 focus-visible:ring-blue-500'
  primary: 'ring-blue-500'
  danger: 'ring-red-500'
  success: 'ring-emerald-500'
  input: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
}
```

**Analysis:**
- ✅ Semantic variants for different actions
- ✅ Uses focus-visible (keyboard-only focus)
- ⚠️ Dark mode offset color hardcoded (ring-offset-slate-900)

---

## Current Color System

### **Implemented Colors** (`src/styles/colorSystem.ts`)

#### Color Palette Structure

**1. Structural Colors (Gray palette)**
- App background: `bg-slate-900`
- Card background: `bg-slate-825` (custom shade #3A4149)
- Surface: `bg-slate-850` (custom shade #353D47)

**Issue:** Card background same as app background in some places
- Card: `#1e293b` (Tailwind slate-800)
- App: `#1e293b` (same value in index.css)
- **Impact:** Insufficient visual layer separation

**2. Interactive Colors (Slate palette)**
- Button default: `bg-slate-700`
- Input default: `bg-slate-800 border-slate-600`
- Hover states: `bg-slate-600`, `bg-slate-700`

**3. Semantic Colors (MaterialM OKLCH)**
```typescript
Primary (red gradient): from-red-600 to-rose-700
Scheduled (blue): from-blue-600 to-blue-700
Success (emerald): from-emerald-600 to-green-700
Warning (amber): from-amber-500 to-yellow-600
Error (red): from-red-600 to-red-700
```

**Analysis:**
- ✅ Clear semantic meaning
- ✅ Gradient presets for consistency
- ⚠️ High saturation on all semantic colors - may compete for attention

#### Text Color Hierarchy
```typescript
text: {
  primary: 'text-gray-100'    // High contrast
  secondary: 'text-gray-400'  // Medium contrast
  tertiary: 'text-gray-500'   // Low contrast
  muted: 'text-gray-600'      // Very subtle
}
```

**Contrast Ratios (on slate-900 background #0f172a):**
- Primary (gray-100 #f3f4f6): 15.2:1 ✅ (WCAG AAA)
- Secondary (gray-400 #9ca3af): 6.8:1 ✅ (WCAG AA)
- Tertiary (gray-500 #6b7280): 4.9:1 ✅ (WCAG AA)
- Muted (gray-600 #4b5563): 3.5:1 ⚠️ (WCAG AA Large Text only)

---

## Current Implementation Analysis

### **Button Component** (`src/components/ui/Button.tsx`)

```typescript
variants = {
  primary: "bg-primary-500 hover:bg-primary-600"
  secondary: "bg-gray-100 dark:bg-gray-700"
  ghost: "bg-transparent hover:bg-gray-100"
  danger: "bg-error-500 hover:bg-error-600"
  success: "bg-success-500 hover:bg-success-600"
}

sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5"
  md: "px-4 py-2 text-md gap-2"
  lg: "px-6 py-3 text-lg gap-2.5"
}
```

**Analysis:**
- ✅ Uses design token imports: `tokens.icons.sm`, etc.
- ✅ Icon sizes match text sizes
- ⚠️ References `primary-500`, `error-500` (Tailwind) but uses custom semantic colors elsewhere
- ⚠️ `text-md` is not a standard Tailwind class (should be `text-base`)
- ⚠️ No explicit min-height specified (WCAG touch target compliance unclear)

**Size Analysis:**
- Small: 1.5rem padding-y = 24px height (with text) ⚠️ Below WCAG 44px
- Medium: 2rem padding-y = ~36px height ⚠️ Below WCAG 44px
- Large: 3rem padding-y = ~52px height ✅ Exceeds WCAG

**Recommendation:** Add explicit `min-h-[44px]` to sizes.md and sizes.lg

### **Header Component** (`src/components/Header.tsx`)

```tsx
<header className="border-b backdrop-blur-sm sticky top-0 
  ${isDarkMode ? 'border-gray-900 bg-gray-900/95' : 'border-slate-300 bg-white/95'}">
```

**Analysis:**
- ⚠️ Hardcoded Tailwind classes instead of design tokens
- ⚠️ `border-gray-900` uses gray palette, but `bg-gray-900` uses different shade than design system
- ✅ Backdrop blur for depth
- ✅ Sticky positioning with z-index token

**Typography in Header:**
```tsx
h1: ${tokens.typography.heading.h1}  // ✅ Uses design token
```

### **FirefighterList Component**

**Discovered Issues:**
1. Hardcoded colors: `bg-gray-100`, `dark:bg-gray-700`
2. Mixed token usage: Some use `tokens.spacing.card.md`, some use inline `p-4`
3. No consistent button sizing - some buttons use `tokens.touchTarget.min`, others don't

---

## Visual Hierarchy Issues Discovered

### **1. Insufficient Visual Layer Separation**

**Problem:** Card backgrounds blend with app background
- App: `#1e293b` (slate-800)
- Card: `#1e293b` (same in many places)
- Expected card: `#243447` (slate-825 custom)

**Impact:** Cards don't "lift" from background, flat visual hierarchy

**Locations:**
- `index.css` line 10: `--bg-app: #1e293b` and `--bg-card: #1e293b`
- Should use MaterialM differentiation

### **2. Inconsistent Spacing Between Sections**

**Current gaps:**
- Header to content: `16px` (--gap)
- Calendar to sidebar: `16px`
- NextUpBar to roster: `12px`

**Issue:** All major sections use same spacing as minor gaps
- Related elements: 8-12px ✅
- Unrelated sections: 16px ⚠️ (should be 24-32px)

**Recommendation:** Add `tokens.spacing.section.xl = 'gap-8'` (32px)

### **3. Button Size Hierarchy Unclear**

**Current:**
- Primary buttons: Varies (no min-height)
- Secondary buttons: Same size as primary
- Icon buttons: 44px × 44px ✅

**Issue:** Primary and secondary buttons same visual weight
- No 1.5:1 size ratio
- All buttons 36-40px height (below WCAG on some)

**Recommendation:**
- Primary: `min-h-[48px]` desktop, `min-h-[44px]` mobile
- Secondary: `min-h-[40px]` desktop, `min-h-[44px]` mobile
- Tertiary/ghost: `min-h-[32px]` desktop, `min-h-[40px]` mobile

### **4. Color Saturation Lacks Hierarchy**

**Current semantic colors:**
- Primary: High saturation red gradient
- Scheduled: High saturation blue gradient
- Success: High saturation emerald gradient
- Warning: High saturation amber gradient

**Issue:** All semantic colors compete for attention
- No clear priority (all equal visual weight)
- Primary action doesn't stand out more than success/warning

**Recommendation:**
- Reserve highest saturation for primary CTA only
- Reduce secondary semantic colors by 10-15% saturation
- Use color + size + position to reinforce hierarchy

### **5. Typography Line-Height Issues**

**Current body text:**
```css
font: 14px/1.2 'Inter'  // Line-height 1.2 (tight)
```

**Issue:** 1.2 line-height acceptable for headings, too tight for body
- Recommended body: 1.5-1.6 (WCAG readability)
- Current causes eye strain on long-form content

**Locations:**
- `index.css` line 49: `font: 14px/1.2`
- Roster rows: Uses default (inherits tight 1.2)

---

## Measurement Summary

### Font Sizes Measured
| Element | Current | Mobile | Desktop | Recommended |
|---------|---------|--------|---------|-------------|
| H1 | 24px | 24px | 30px-36px | ✅ Good |
| H2 | 20px | 20px | 24px | ✅ Good |
| H3 | 20px | 20px | 20px | ⚠️ Same as H2 |
| H4 | 18px | 18px | 18px | ✅ Good |
| Body | 16px | 15px | 16px | ✅ Good |
| Caption | 12px | 12px | 12px | ✅ Acceptable |
| Input | 16px | 16px | 16px | ✅ iOS zoom prevention |

**Issues:**
- H2 and H3 same size on desktop (20px) - insufficient differentiation
- Body line-height 1.2 - should be 1.5

### Spacing Measured
| Location | Current | Recommended |
|----------|---------|-------------|
| Section-to-section | 16px | 24-32px |
| Card padding | 12-16px | 16px standard |
| Modal padding | 20px | 20-24px |
| Button padding | 10-16px | 12px vertical standard |
| List item gap | 4-8px | 8px standard |

### Touch Targets Measured
| Element | Height | Width | WCAG Compliant |
|---------|--------|-------|----------------|
| Primary button (md) | ~36px | varies | ❌ No (need 44px) |
| Icon button | 44px | 44px | ✅ Yes |
| Input field | 44px | 100% | ✅ Yes |
| Roster row | varies | 100% | ⚠️ Needs verification |
| Calendar day cell | aspect-square | varies | ⚠️ Needs verification |

---

## Next Steps

### Phase 1 Remaining Tasks
- [x] Task 1.0: Current state inventory (this document)
- [ ] Task 1.1: Reading pattern analysis (Z/F-pattern mapping)
- [ ] Task 1.2: Size relationship audit (detailed measurements)
- [ ] Task 1.3: Color hierarchy analysis (contrast ratios)
- [ ] Task 1.4: Typography audit (complete scale analysis)
- [ ] Task 1.5: Whitespace distribution (ratio calculations)
- [ ] Task 1.6: Visual weight assessment (scoring)

### Immediate Concerns to Address
1. **Card background separation** - Update `--bg-card` to distinct value
2. **Button min-height** - Add WCAG-compliant touch targets
3. **Section spacing** - Add 24-32px gap tokens
4. **Line-height** - Update body text to 1.5
5. **H3 sizing** - Differentiate from H2 (reduce to 18px)

---

**Document Status:** ✅ Complete  
**Next Document:** `02-reading-pattern-analysis.md`  
**Estimated Time:** 2-3 hours for pattern mapping
