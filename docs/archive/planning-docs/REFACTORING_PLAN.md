# FirefighterHub Refactoring Plan - shadcn/ui Migration

## Goals
1. ✅ Use shadcn/ui components exclusively
2. ✅ Full viewport utilization (h-screen, no max-width)
3. ✅ NO text truncation anywhere
4. ✅ One line per row/person
5. ✅ Proportional, hierarchical layouts
6. ✅ Beautiful by default

---

## Phase 1: Core Layout & Header ⚡ NOW

### App Layout
**Current:** May have max-width constraints
**Target:** Full viewport flex layout
```tsx
<div className="flex flex-col h-screen">
  <Header className="flex-shrink-0" />
  <main className="flex-1 overflow-auto">
    {children}
  </main>
</div>
```

### Header Component
**Changes:**
- [ ] Use shadcn Button component
- [ ] Replace custom colors with CSS variables
- [ ] Use bg-background, text-foreground
- [ ] Use border-border
- [ ] Keep shift colors (emerald/blue/red only)
- [ ] Remove any text truncation
- [ ] Height: h-16 (fixed)
- [ ] Spacing: Use default Tailwind scale

---

## Phase 2: Shift Selector

**Changes:**
- [ ] Use shadcn Button with variant="outline"
- [ ] Active state: variant="default" + shift color
- [ ] Keep emerald/blue/red for A/B/C
- [ ] No truncation on shift labels
- [ ] Use shadcn Tooltip for context

---

## Phase 3: Roster/Table

**Current:** Custom table styling
**Target:** shadcn Table component

**Changes:**
- [ ] Import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
- [ ] Add whitespace-nowrap to all cells
- [ ] sticky top-0 on TableHeader
- [ ] Full height: h-full flex flex-col pattern
- [ ] Scrollable tbody area
- [ ] Use shadcn Badge for shift indicators
- [ ] text-muted-foreground for secondary info

---

## Phase 4: Calendar

**Changes:**
- [ ] Full viewport grid
- [ ] h-full flex flex-col pattern
- [ ] Calendar fills flex-1
- [ ] Use shadcn Button for navigation
- [ ] Use bg-card for day cells
- [ ] border-border for grid lines
- [ ] NO truncation on event names
- [ ] Events overflow-auto within cells

---

## Phase 5: Cards & Containers

**Replace all custom cards with:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
```

**Pattern:**
- [ ] Remove custom bg colors → use bg-card
- [ ] Remove custom borders → use border-border
- [ ] Use p-6 for CardContent
- [ ] CardTitle: text-xl font-semibold
- [ ] CardDescription: text-sm text-muted-foreground

---

## Phase 6: Colors Migration

**Find & Replace:**
```
slate-900 → bg-background
slate-800 → bg-card
slate-700 → border-border
slate-100 → text-foreground (dark)
slate-400 → text-muted-foreground (dark)
white → bg-background (light)
```

**Keep Only:**
- emerald-600 (Shift A)
- blue-600 (Shift B)
- red-600 (Shift C)

---

## Phase 7: Typography

**Apply hierarchy:**
```tsx
// Page titles
className="text-2xl font-bold"

// Section headers
className="text-xl font-semibold"

// Labels
className="text-sm text-muted-foreground"

// Body
className="text-base"
```

---

## Phase 8: Remove Truncation

**Find and delete:**
- truncate
- text-ellipsis
- overflow-hidden (on text containers)
- line-clamp-*
- max-w-* (on text elements)

**Add instead:**
- whitespace-nowrap (for one-line display)
- overflow-auto (for scrollable containers)
- flex-shrink-0 (prevent shrinking)

---

## Phase 9: Full Viewport

**App.tsx or main layout:**
```tsx
<div className="h-screen flex flex-col">
  <Header className="h-16 flex-shrink-0 border-b" />
  <div className="flex-1 flex overflow-hidden">
    <aside className="w-64 flex-shrink-0 border-r overflow-auto">
      {/* Sidebar if needed */}
    </aside>
    <main className="flex-1 overflow-auto">
      <div className="h-full w-full">
        {/* Content uses full available space */}
      </div>
    </main>
  </div>
</div>
```

---

## Phase 10: Testing

- [ ] All text visible (no truncation)
- [ ] Full viewport utilized
- [ ] Proper scrolling
- [ ] Visual hierarchy clear
- [ ] Responsive works
- [ ] Dark/light mode works
- [ ] Shift colors preserved
- [ ] No custom colors (except shifts)
- [ ] Components use shadcn defaults

---

## Implementation Order

1. **NOW**: Install components → Header refactor
2. **Next**: ShiftSelector → use Button variants
3. **Then**: Roster → use Table component
4. **Then**: Calendar → full space grid
5. **Then**: Cards → Card component
6. **Then**: Colors → CSS variables
7. **Then**: Typography → hierarchy
8. **Then**: Remove truncation globally
9. **Then**: Full viewport layout
10. **Finally**: Test everything

---

## Success Criteria

✅ Zero custom color values (except shift colors)
✅ All components from shadcn/ui
✅ No text truncation anywhere
✅ Full viewport space used
✅ Proper visual hierarchy
✅ Beautiful, clean, professional
✅ Maintainable, standard approach
