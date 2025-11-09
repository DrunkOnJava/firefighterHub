# Phase 5 Legacy UI Cleanup - Progress Report

## Overview
Phase 5 focuses on removing isDarkMode props, replacing hardcoded colors, converting inline styles, and removing CSS variable usage from consumer components.

## Progress Summary

### ✅ Completed (Part 1)

#### Files Cleaned (10 files)
1. **src/App.tsx**
   - Removed inline styles from loading state → `className="p-5 text-foreground"`
   - Replaced skip link colors: `bg-blue-600` → `bg-primary`
   - Converted toast notifications from inline styles to Tailwind classes
   - Added void suppression for isDarkMode (managed by hook)

2. **src/components/ConfirmDialog.tsx**
   - Replaced icon background colors with semantic variants:
     - `bg-red-100/dark:bg-red-900/30` → `bg-destructive/10 dark:bg-destructive/20`
     - `bg-blue-100/dark:bg-blue-900/30` → `bg-primary/10 dark:bg-primary/20`
   - Button colors: `bg-red-600 hover:bg-red-700` → `bg-destructive hover:bg-destructive/90`

3. **src/components/TransferShiftModal.tsx**
   - Header: `bg-blue-900/20 border-blue-700/50` → `bg-primary/10 border-primary/50`
   - Icon: `text-blue-400` → `text-primary`
   - Text: `text-white` → `text-foreground`
   - Selected shift button: `bg-blue-600` → `bg-primary`

4. **src/components/ActivityLog.tsx**
   - Action type colors:
     - `bg-red-500/10` → `bg-destructive/10`
     - `bg-blue-500/10` → `bg-primary/10`

5. **src/components/FirefighterList.tsx**
   - Removed isDarkMode prop passing to RosterHeader

6. **src/components/MobileNav.tsx**
   - Removed isDarkMode from props interface
   - Now reads dark mode from DOM: `document.documentElement.classList.contains('dark')`

7. **src/components/calendar/CalendarLegend.tsx**
   - Removed isDarkMode prop completely
   - Today ring: `ring-blue-500` → `ring-primary`

8. **src/components/calendar/MainCalendar.tsx**
   - Removed isDarkMode from props interface
   - Now reads dark mode from DOM

9. **src/components/roster/RosterHeader.tsx**
   - Removed isDarkMode prop completely
   - Icon background: `from-blue-600 to-blue-700` → `from-primary to-primary/90`
   - Icon color: `text-white` → `text-primary-foreground`

10. **src/components/roster/RosterSearchBar.tsx**
    - Removed isDarkMode prop completely

### 📊 Metrics

**Before Phase 5:**
- isDarkMode usages: 209
- Files with isDarkMode: 33

**After Part 1:**
- isDarkMode usages: 157 (↓ 25%)
- Files with isDarkMode: 23 (↓ 30%)
- TypeScript errors: 0 new errors
- Build status: ✓ Successful

### 🚧 Remaining Work (23 files)

#### High Priority - Calendar Components (8 files)
1. `src/components/calendar/DayCell.tsx`
2. `src/components/calendar/CalendarHeader.tsx`
3. `src/components/calendar/HoldList.tsx`
4. `src/components/calendar/CalendarGrid.tsx`
5. `src/components/calendar/DayModal.tsx`
6. `src/components/calendar/DayScheduleModal.tsx`
7. `src/components/calendar/HoldForm.tsx`
8. `src/components/CalendarView.tsx`

#### Medium Priority - Core Components (6 files)
9. `src/components/FirefighterList.tsx` - Uses isDarkMode for drag-and-drop styling
10. `src/components/Calendar.tsx`
11. `src/components/CalendarSubscribeModal.tsx`
12. `src/components/Sidebar.tsx`
13. `src/components/NextUpBar.tsx`
14. `src/components/FirefightersModal.tsx`

#### Lower Priority - Mobile & Tablet (5 files)
15. `src/components/mobile/SwipeableCard.tsx`
16. `src/components/mobile/FirefighterCard.tsx`
17. `src/components/mobile/MobileWeekView.tsx`
18. `src/components/MobileNav.new.tsx`
19. `src/components/tablet/FirefighterGrid.tsx`

#### Utility Components (4 files)
20. `src/components/Header.tsx` - Already reads from DOM ✓
21. Various test files (can skip)

### 🎯 Next Steps

#### Strategy for Part 2
1. **Pattern: Read from DOM instead of props**
   ```typescript
   // Remove from props interface
   interface ComponentProps {
     // isDarkMode?: boolean; ❌ Remove this
   }
   
   // Add at top of component
   export function Component({ ...props }: ComponentProps) {
     const isDarkMode = document.documentElement.classList.contains('dark');
     // ... rest of component
   }
   ```

2. **Convert conditional classNames to dark: variants where possible**
   ```typescript
   // Before
   className={isDarkMode ? 'bg-slate-800' : 'bg-white'}
   
   // After  
   className="bg-white dark:bg-slate-800"
   ```

3. **Replace remaining hardcoded colors**
   - `bg-blue-*` → `bg-primary/*`
   - `bg-red-*` → `bg-destructive/*`
   - `bg-slate-800` → `bg-card`

#### Special Cases to Handle
- **FirefighterList.tsx**: Uses isDarkMode for drag preview styling - may need to create a custom drag preview component or read from DOM at drag time
- **Calendar components**: Many conditional classes - consider converting to Tailwind dark: variants
- **Mobile components**: Extensive isDarkMode usage - may benefit from batch conversion

### 🔍 Verification Checklist

Before finalizing Phase 5:
- [ ] TypeScript compilation passes
- [ ] Build succeeds
- [ ] Dark mode toggle works in all cleaned components
- [ ] No visual regressions
- [ ] All semantic colors applied correctly
- [ ] No remaining inline styles in cleaned files
- [ ] No CSS variables (var(--*)) in cleaned files

### 📝 Notes

**Shift Badge Colors**: Intentionally kept as explicit colors (not semantic):
- Shift A: `bg-emerald-600` (green)
- Shift B: `bg-blue-600` (blue)  
- Shift C: `bg-red-600` (red)

These are domain-specific colors that should NOT be replaced with semantic tokens.

**Pre-existing Errors**: 5 TypeScript errors exist but are unrelated to this work:
- AnimatedButton animation options
- IconButton unused variable
- Test mock issues
- Performance monitor process reference

## Timeline

**Part 1 Completed**: 2025-11-09
**Estimated Part 2 Duration**: 2-3 hours
**Target Completion**: 2025-11-10

## Related Issues

- #37 - Visual Hierarchy Master Tracking
- Design System documentation in `src/styles/`
