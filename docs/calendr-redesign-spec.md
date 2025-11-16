# FirefighterHub → Calendr Design Redesign Specification

## Executive Summary

This document outlines the comprehensive redesign of firefighterHub to match the Calendr-style interface shown in the reference image. The redesign focuses on:

1. **Left sidebar personnel roster** replacing top "Next Up" cards
2. **Clean calendar grid** with event blocks (not pills)
3. **Dark theme refinement** with better contrast and spacing
4. **Simplified navigation** with month selector and search
5. **Event-centric display** showing holds as colored blocks

---

## 1. Layout Transformation

### Current Layout
```
┌─────────────────────────────────────────────┐
│ Header (Next Up Cards + Controls)          │
├─────────────────────────────────────────────┤
│                                             │
│            Calendar (Full Width)            │
│                                             │
│   ┌─────┬─────┬─────┬─────┬─────┬─────┐   │
│   │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │   │
│   ├─────┼─────┼─────┼─────┼─────┼─────┤   │
│   │  1  │  2  │  3  │  4  │  5  │  6  │   │
│   │ 🔴  │ 🔵  │     │ 🟢  │     │     │   │
│   └─────┴─────┴─────┴─────┴─────┴─────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Target Layout (Calendr Style)
```
┌──────────┬──────────────────────────────────┐
│ Personnel│  November 2025    [< Today >]  🔍│
│ Roster   ├──────────────────────────────────┤
│          │ Sun Mon Tue Wed Thu Fri Sat      │
├──────────┤                                   │
│  1. FF-2 │  26  27  28  29  30  31   1      │
│  2. Ryan │   3   4   5   6   7   8   9      │
│  3. Eric │      🗳️  🎮       🎮             │
│  4. Anisa│                                   │
│  5. Scott│  10  11  12  13  14  15  16      │
│  6. Mike │      🇺🇸  🎮  🦃                  │
│  ...     │                                   │
│          │  17  18  19  20  21  22  23      │
│ 38. Josh │           🎮                      │
│          │                                   │
│ [Filter] │  24  25  26  27  28  29  30      │
│ [Sort]   │      🦃🎮  ⚫                      │
└──────────┴──────────────────────────────────┘
```

### Implementation Changes

#### Desktop Layout (≥1024px)
```tsx
<div className="flex h-screen">
  {/* Left Sidebar - Personnel Roster */}
  <aside className="w-80 border-r border-gray-800 bg-gray-950">
    <RosterSidebar />
  </aside>

  {/* Main Calendar Area */}
  <main className="flex-1 overflow-auto">
    <CalendarHeader />
    <CalendarGrid />
  </main>
</div>
```

#### Mobile Layout (<1024px)
```tsx
<div className="flex flex-col h-screen">
  {/* Collapsible Roster */}
  <MobileRosterDrawer />

  {/* Calendar (Full Width) */}
  <main className="flex-1">
    <CalendarHeader />
    <CalendarGrid />
  </main>

  {/* Bottom Navigation */}
  <BottomNav />
</div>
```

---

## 2. Component Specifications

### 2.1 Personnel Roster Sidebar

**File:** `src/components/RosterSidebar.tsx`

#### Visual Design
- **Width:** 320px (20rem) on desktop
- **Background:** `bg-gray-950` with `border-r border-gray-800`
- **Scroll:** Independent scroll for roster list
- **Sticky Header:** Filter/sort controls at top

#### Structure
```tsx
<RosterSidebar>
  {/* Header with Title */}
  <div className="sticky top-0 bg-gray-950 z-10 p-4 border-b border-gray-800">
    <h2>Personnel Roster</h2>
    <div className="flex gap-2 mt-2">
      <Button variant="ghost" size="sm">
        <Filter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  </div>

  {/* Roster List */}
  <div className="p-2">
    {roster.map((firefighter, index) => (
      <RosterItem
        key={firefighter.id}
        number={index + 1}
        firefighter={firefighter}
      />
    ))}
  </div>
</RosterSidebar>
```

#### RosterItem Component
```tsx
<button className="
  w-full px-3 py-2 rounded-md
  flex items-center justify-between
  hover:bg-gray-900 transition-colors
  text-left
  group
">
  <div className="flex items-center gap-2">
    <span className="text-gray-500 text-sm">{number}</span>
    <span className="text-gray-200">{name}</span>
  </div>

  {/* Expandable Indicator */}
  <ChevronDown className="
    h-4 w-4 text-gray-600
    group-hover:text-gray-400
    transition-transform
    group-aria-expanded:rotate-180
  "/>
</button>

{/* Expanded Details (if applicable) */}
{isExpanded && (
  <div className="pl-8 py-2 text-sm text-gray-400">
    <div>Station: {station}</div>
    <div>Shift: {shift}</div>
    <div>Last Hold: {lastHold}</div>
  </div>
)}
```

#### Key Interactions
- Click to expand/collapse firefighter details
- Hover effect with `bg-gray-900`
- Number prefix (1-38+) for quick reference
- Chevron rotates on expansion
- Optional filtering (top controls)

---

### 2.2 Calendar Header

**File:** `src/features/schedule/components/calendar/CalendarHeader.tsx`

#### Visual Design (Calendr Style)
```
┌─────────────────────────────────────────────────────┐
│ November 2025    [<  Today  >]  [+ New Event]   🔍  │
└─────────────────────────────────────────────────────┘
```

#### Structure
```tsx
<header className="
  sticky top-0 z-20
  bg-gray-950 border-b border-gray-800
  px-6 py-4
  flex items-center justify-between
">
  {/* Month/Year Display */}
  <div className="flex items-center gap-4">
    <h1 className="text-2xl font-bold text-white">
      {format(currentMonth, 'MMMM yyyy')}
    </h1>

    {/* Month Navigation */}
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={previousMonth}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        onClick={goToToday}
      >
        Today
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  </div>

  {/* Right Actions */}
  <div className="flex items-center gap-2">
    <Button
      variant="default"
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Event
    </Button>

    <Button variant="ghost" size="icon">
      <Search className="h-5 w-5" />
    </Button>

    <Button variant="ghost" size="icon">
      <Settings className="h-5 w-5" />
    </Button>
  </div>
</header>
```

#### Key Changes from Current
- Remove "Next Up" cards (moved to sidebar)
- Simplify to just month nav + actions
- Blue "New Event" button (primary action)
- Search icon on right
- Cleaner, more spacious layout

---

### 2.3 Calendar Grid

**File:** `src/features/schedule/components/calendar/CalendarGrid.tsx`

#### Visual Design
- **Background:** `bg-gray-950`
- **Grid Lines:** `border-gray-800` (1px)
- **Cell Height:** Auto (based on events)
- **Event Blocks:** Colored rectangles (not pills)

#### Grid Structure
```tsx
<div className="calendar-grid grid grid-cols-7 auto-rows-auto border-t border-gray-800">
  {/* Day Headers */}
  <div className="col-span-7 grid grid-cols-7 border-b border-gray-800">
    {dayNames.map(day => (
      <div key={day} className="
        py-2 text-center text-sm font-medium text-gray-400
        border-r border-gray-800 last:border-r-0
      ">
        {day}
      </div>
    ))}
  </div>

  {/* Calendar Days */}
  {daysInMonth.map(day => (
    <CalendarDay
      key={day.date}
      date={day.date}
      events={day.events}
      isToday={day.isToday}
      isCurrentMonth={day.isCurrentMonth}
    />
  ))}
</div>
```

#### CalendarDay Component
```tsx
<div className="
  border-r border-b border-gray-800
  last:border-r-0
  min-h-[120px]
  p-2
  hover:bg-gray-900/50 transition-colors
  cursor-pointer
  group
">
  {/* Day Number */}
  <div className={cn(
    "text-sm font-medium mb-1",
    isToday && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center",
    !isToday && isCurrentMonth && "text-gray-200",
    !isToday && !isCurrentMonth && "text-gray-600"
  )}>
    {format(date, 'd')}
  </div>

  {/* Events */}
  <div className="space-y-1">
    {events.map(event => (
      <EventBlock key={event.id} event={event} />
    ))}
  </div>

  {/* Overflow Indicator */}
  {hasMoreEvents && (
    <button className="text-xs text-gray-400 hover:text-gray-200 mt-1">
      +{overflowCount} more
    </button>
  )}
</div>
```

---

### 2.4 Event Block Component

**File:** `src/features/schedule/components/calendar/EventBlock.tsx`

#### Calendr-Style Event (NOT Pill)
```tsx
<div className={cn(
  "px-2 py-1 rounded text-xs font-medium",
  "truncate cursor-pointer",
  "hover:brightness-110 transition-all",
  getEventColorClass(event.type, event.status)
)}>
  {/* Time + Name */}
  <div className="flex items-center gap-1">
    {event.time && (
      <span className="opacity-80">{event.time}</span>
    )}
    <span className="truncate">{event.title}</span>
  </div>
</div>
```

#### Event Color Mapping
```tsx
function getEventColorClass(type: EventType, status?: EventStatus) {
  // Regular Holds (Blue family - like "Game night!")
  if (type === 'hold' && status === 'scheduled') {
    return 'bg-blue-600 text-white border-l-4 border-blue-400'
  }

  // Completed Holds (Green/Teal)
  if (type === 'hold' && status === 'completed') {
    return 'bg-teal-600 text-white border-l-4 border-teal-400'
  }

  // Holidays (Green - like "Thanksgiving", "Halloween")
  if (type === 'holiday') {
    return 'bg-green-700 text-white border-l-4 border-green-500'
  }

  // Special Events (Orange/Yellow)
  if (type === 'special') {
    return 'bg-orange-600 text-white border-l-4 border-orange-400'
  }

  // Default
  return 'bg-gray-700 text-gray-200 border-l-4 border-gray-500'
}
```

---

## 3. Color Scheme Refinement

### Current Colors (to adjust)
```css
/* Too bright for Calendr style */
--primary: 210 85% 51%;        /* #196FEB */
--success: 162 77% 52%;        /* #2ADBA9 */
--warning: 47 95% 57%;         /* #F7E030 */
```

### Target Calendr Colors
```css
/* Darker, more sophisticated palette */
--calendr-blue: 217 91% 60%;       /* #3B82F6 (Tailwind blue-500) */
--calendr-green: 142 71% 45%;      /* #10B981 (Tailwind green-600) */
--calendr-teal: 173 80% 40%;       /* #14B8A6 (Tailwind teal-600) */
--calendr-orange: 25 95% 53%;      /* #F97316 (Tailwind orange-500) */

/* Background layers */
--calendr-bg-base: 222 47% 4%;     /* #020617 (Tailwind slate-950) */
--calendr-bg-elevated: 217 33% 8%; /* #0F172A (Tailwind slate-900) */
--calendr-border: 215 28% 17%;     /* #1E293B (Tailwind slate-800) */

/* Text hierarchy */
--calendr-text-primary: 0 0% 98%;  /* #FAFAFA (White) */
--calendr-text-secondary: 0 0% 71%;/* #B4B4B4 (Gray 400) */
--calendr-text-muted: 0 0% 51%;    /* #828282 (Gray 500) */
```

### Update index.css
```css
@layer base {
  :root {
    /* ... existing light mode colors ... */
  }

  .dark {
    /* Calendr Dark Theme */
    --background: 222 47% 4%;         /* Deeper black */
    --foreground: 0 0% 98%;

    --card: 217 33% 8%;               /* Slightly elevated */
    --card-foreground: 0 0% 98%;

    --primary: 217 91% 60%;           /* Blue for events */
    --primary-foreground: 0 0% 100%;

    --secondary: 215 28% 17%;         /* Gray for borders */
    --secondary-foreground: 0 0% 98%;

    --muted: 217 33% 8%;
    --muted-foreground: 0 0% 71%;

    --success: 142 71% 45%;           /* Green for holidays */
    --warning: 25 95% 53%;            /* Orange for alerts */
    --destructive: 0 84% 60%;         /* Red for errors */

    --border: 215 28% 17%;            /* Consistent grid lines */
    --ring: 217 91% 60%;              /* Blue focus rings */
  }
}
```

---

## 4. Typography & Spacing

### Font Sizes (Calendr Style)
```css
/* Smaller, more compact than current */
--calendr-text-xs: 0.625rem;    /* 10px - event times */
--calendr-text-sm: 0.75rem;     /* 12px - event names */
--calendr-text-base: 0.875rem;  /* 14px - day numbers */
--calendr-text-lg: 1rem;        /* 16px - headers */
--calendr-text-xl: 1.25rem;     /* 20px - month/year */
```

### Spacing Scale
```css
/* Tighter spacing for dense calendar */
--calendr-space-1: 0.25rem;  /* 4px */
--calendr-space-2: 0.5rem;   /* 8px */
--calendr-space-3: 0.75rem;  /* 12px */
--calendr-space-4: 1rem;     /* 16px */
```

### Apply to Components
```tsx
// Event blocks
className="px-2 py-1 text-xs"  // Instead of px-3 py-2 text-sm

// Day cells
className="p-2"                 // Instead of p-4

// Headers
className="text-xl"             // Instead of text-2xl
```

---

## 5. Implementation Roadmap

### Phase 1: Layout Restructuring (1-2 days)
- [ ] Create `RosterSidebar.tsx` component
- [ ] Create `RosterItem.tsx` component
- [ ] Update `SchedulePage.tsx` to use sidebar layout
- [ ] Implement responsive breakpoint (hide sidebar on mobile)
- [ ] Test sidebar scroll behavior

### Phase 2: Calendar Grid Redesign (2-3 days)
- [ ] Refactor `CalendarGrid.tsx` for block-style events
- [ ] Create new `EventBlock.tsx` (replace AppointmentPill)
- [ ] Update `CalendarDay.tsx` for cleaner cells
- [ ] Implement overflow "+N more" indicator
- [ ] Add hover/click interactions

### Phase 3: Header Simplification (1 day)
- [ ] Remove "Next Up" cards from header
- [ ] Add "New Event" button
- [ ] Add search icon/functionality
- [ ] Simplify month navigation controls
- [ ] Test sticky header behavior

### Phase 4: Color & Theme Update (1 day)
- [ ] Update `index.css` with Calendr color palette
- [ ] Test dark mode exclusively (Calendr is dark-first)
- [ ] Adjust event colors (blue, green, orange)
- [ ] Verify contrast ratios (WCAG AA)
- [ ] Update shadow/border colors

### Phase 5: Mobile Responsiveness (1-2 days)
- [ ] Convert sidebar to drawer on mobile
- [ ] Test calendar grid on small screens
- [ ] Ensure touch targets ≥44px
- [ ] Test bottom navigation integration
- [ ] Verify swipe gestures work

### Phase 6: Polish & Testing (1 day)
- [ ] Add loading states
- [ ] Test with real data (30+ events)
- [ ] Verify keyboard navigation
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (axe DevTools)

---

## 6. Key Files to Modify

### New Files
```
src/components/
├── RosterSidebar.tsx              # NEW: Personnel list
├── RosterItem.tsx                 # NEW: Individual roster entry
└── layout/
    └── CalendrLayout.tsx          # NEW: Main layout wrapper

src/features/schedule/components/calendar/
├── EventBlock.tsx                 # NEW: Replace AppointmentPill
└── CalendarGrid.tsx               # NEW: Redesigned grid
```

### Modified Files
```
src/
├── App.tsx                        # Layout integration
├── index.css                      # Color scheme update
└── pages/
    └── SchedulePage.tsx           # Use new layout

src/features/schedule/components/calendar/
├── MainCalendar.tsx               # Simplified (remove Next Up)
├── CalendarHeader.tsx             # Simplified header
├── CalendarDay.tsx                # Event block integration
└── DayCell.tsx                    # Use EventBlock component
```

### Deprecated Files (Archive)
```
src/features/schedule/components/calendar/
└── AppointmentPill.tsx            # Replaced by EventBlock
```

---

## 7. Design Comparison Matrix

| Feature | Current (firefighterHub) | Target (Calendr) |
|---------|-------------------------|------------------|
| **Layout** | Single column, full-width calendar | Sidebar + calendar grid |
| **Personnel** | "Next Up" cards in header | Full roster in left sidebar |
| **Event Display** | Rounded pills with badges | Rectangle blocks with left border |
| **Color Scheme** | Bright blues/greens/yellows | Deeper blues/teals/oranges |
| **Calendar Type** | react-day-picker (custom) | Grid-based month view |
| **Event Density** | 3-4 events max per cell | Unlimited with overflow |
| **Navigation** | Header with shift selector | Simple month nav + search |
| **Mobile** | Bottom nav + full calendar | Drawer sidebar + calendar |
| **Typography** | Larger (14-16px base) | Smaller (12-14px base) |
| **Spacing** | Generous (p-4, gap-4) | Compact (p-2, gap-2) |

---

## 8. Success Metrics

### Visual Alignment
- [ ] Sidebar matches reference image width/style
- [ ] Calendar grid spacing matches reference
- [ ] Event blocks have correct color/border
- [ ] Typography sizes match reference
- [ ] Dark theme matches reference contrast

### Functional Requirements
- [ ] All existing features work (hold scheduling, etc.)
- [ ] Roster sidebar collapses on mobile
- [ ] Events display correctly in blocks
- [ ] Month navigation works smoothly
- [ ] Search functionality integrated

### Performance Targets
- [ ] Initial render < 1s
- [ ] Month navigation < 200ms
- [ ] Sidebar scroll smooth (60fps)
- [ ] Bundle size increase < 10%

### Accessibility
- [ ] WCAG AA color contrast
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Touch targets ≥44px

---

## 9. Risk Mitigation

### High Risk Areas
1. **Data Migration**: Ensure event data works with new EventBlock format
   - Mitigation: Create adapter layer, test with production data dump

2. **Mobile Layout**: Sidebar drawer may conflict with existing nav
   - Mitigation: Use separate drawer component, test on real devices

3. **Performance**: More complex layout may slow rendering
   - Mitigation: Profile with React DevTools, memoize heavy components

### Medium Risk Areas
1. **Responsive Breakpoints**: Calendar grid may not scale well
   - Mitigation: Test at multiple screen sizes, adjust grid columns

2. **Color Contrast**: Darker theme may fail WCAG
   - Mitigation: Use contrast checker, adjust colors as needed

---

## 10. Next Steps

### Immediate Actions
1. **Review this spec with team/stakeholders**
2. **Create branch: `feature/calendr-redesign`**
3. **Set up development environment**
4. **Begin Phase 1: Layout Restructuring**

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/calendr-redesign

# Implement phase by phase
# Commit frequently with descriptive messages
git commit -m "feat(calendar): add RosterSidebar component"

# Test at each phase
pnpm run typecheck
pnpm run build
pnpm run dev

# Create PR when complete
gh pr create --title "Calendr-style redesign" --body "..."
```

---

## Appendix A: Component Hierarchy

```
App.tsx
└── CalendrLayout.tsx
    ├── RosterSidebar.tsx
    │   ├── RosterHeader.tsx
    │   │   ├── FilterButton
    │   │   └── SortButton
    │   └── RosterList.tsx
    │       └── RosterItem.tsx[] (map)
    │
    └── Main
        ├── CalendarHeader.tsx
        │   ├── MonthSelector
        │   ├── Navigation
        │   ├── NewEventButton
        │   └── SearchButton
        │
        └── CalendarGrid.tsx
            ├── DayHeaders
            └── CalendarDay.tsx[] (map)
                ├── DayNumber
                ├── EventBlock.tsx[] (map)
                └── OverflowIndicator
```

---

## Appendix B: CSS Variables Reference

```css
/* Calendr Design System */
:root {
  /* Event Colors */
  --event-scheduled: 217 91% 60%;    /* Blue */
  --event-completed: 173 80% 40%;    /* Teal */
  --event-holiday: 142 71% 45%;      /* Green */
  --event-alert: 25 95% 53%;         /* Orange */

  /* Layout */
  --sidebar-width: 20rem;            /* 320px */
  --header-height: 4rem;             /* 64px */
  --calendar-cell-min-height: 7.5rem;/* 120px */

  /* Spacing */
  --calendr-gap-sm: 0.5rem;          /* 8px */
  --calendr-gap-md: 1rem;            /* 16px */
  --calendr-gap-lg: 1.5rem;          /* 24px */

  /* Border Radius */
  --calendr-radius-sm: 0.375rem;     /* 6px */
  --calendr-radius-md: 0.5rem;       /* 8px */
  --calendr-radius-lg: 0.75rem;      /* 12px */
}
```

---

**Document Version:** 1.0
**Last Updated:** {{ today }}
**Status:** Ready for Implementation
**Estimated Timeline:** 7-10 days
**Priority:** High

