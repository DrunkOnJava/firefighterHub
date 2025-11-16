# Follow-Up GitHub Issues for PR #81

**Instructions:** Manually create these 5 issues on GitHub. Copy the title and body for each.

---

## Issue 1: Global Search Modal

**Title:**
`feat: Add global search modal for calendar events`

**Labels:**
`enhancement`, `calendr-redesign`

**Body:**
```markdown
## Overview
Implement search functionality for the search button added in Calendr redesign (PR #81).

## Requirements
- Global search modal triggered by search button in header
- Search across: firefighter names, stations, hold dates, notes
- Fuzzy matching for better UX
- Keyboard shortcut: Cmd/Ctrl+K
- Recent searches history
- Mobile-optimized

## Implementation
- Create SearchModal.tsx component
- Use Fuse.js for fuzzy search
- Wire up to header search button (src/pages/SchedulePage.tsx:333)

## Related
- PR #81 added the search button UI
- Button currently shows "Coming Soon" toast
```

---

## Issue 2: New Event Modal

**Title:**
`feat: Add "New Event" modal for quick hold scheduling`

**Labels:**
`enhancement`, `calendr-redesign`

**Body:**
```markdown
## Overview
Implement new event creation modal for the "New Event" button added in Calendr redesign (PR #81).

## Requirements
- Quick event creation from any calendar view
- Date picker with default to today
- Firefighter selector
- Duration selection (12h/24h)
- Station assignment
- Optional notes field
- Validation before submission

## Implementation
- Create NewEventModal.tsx component
- Reuse existing hold scheduling logic from useScheduledHolds
- Wire up to header button (src/pages/SchedulePage.tsx:316)

## Related
- PR #81 added the "New Event" button UI
- Button currently shows "Coming Soon" toast
```

---

## Issue 3: Settings Panel

**Title:**
`feat: Add settings panel for app preferences`

**Labels:**
`enhancement`, `calendr-redesign`, `admin`

**Body:**
```markdown
## Overview
Implement settings panel for the settings button added in Calendr redesign (PR #81).

## Requirements (Admin Only)
- Theme preferences (light/dark/system)
- Default shift selection
- Notification preferences
- Calendar view options (month/week/day)
- Export settings
- Data management tools

## Implementation
- Create SettingsPanel.tsx component
- Use shadcn Dialog or Sheet component
- Wire up to header button (src/pages/SchedulePage.tsx:350)
- Persist settings to localStorage

## Related
- PR #81 added the settings button UI
- Button currently shows "Coming Soon" toast
```

---

## Issue 4: Type Safety for Database Enums

**Title:**
`refactor: Strengthen type safety for database enums`

**Labels:**
`refactor`, `typescript`, `tech-debt`

**Body:**
```markdown
## Overview
Database schema uses weak types (`string | null`) for enum fields. Add runtime validation and stronger types.

## Problems Identified in PR #81 Review
- `status: string | null` should be `'completed' | 'skipped' | 'scheduled'`
- No runtime validation of status values
- Default cases hide invalid data
- Silent failures with malformed database data

## Proposed Solution
1. Create runtime validation functions:
   - `isValidHoldStatus(value): value is HoldStatus`
   - `isValidShift(value): value is Shift`
2. Add validation at component boundaries
3. Log invalid data for debugging
4. Consider database CHECK constraints

## Files Affected
- src/lib/supabase.ts (type definitions)
- src/features/schedule/components/calendar/EventBlock.tsx
- src/components/RosterSidebar.tsx

## Related
- Identified in PR #81 type design analysis
- Affects data integrity and error visibility
```

---

## Issue 5: Roster Sidebar Performance

**Title:**
`perf: Optimize roster sidebar with better memoization`

**Labels:**
`performance`, `optimization`

**Body:**
```markdown
## Overview
Further optimize RosterSidebar performance beyond the basic useMemo added in PR #81.

## Current State
- Basic useMemo applied to filter/sort logic (PR #81 commit 967a081)
- Works for current load, but can be further optimized

## Proposed Enhancements
1. **Memoize RosterItem renders**
   - Use React.memo with custom comparison
   - Prevent re-renders when only unrelated props change

2. **Virtualize long lists**
   - Use react-window or react-virtual for 30+ firefighters
   - Only render visible items

3. **Debounce filter/sort changes**
   - Use useDeferredValue for sort changes
   - Prevent rapid re-computations during user interaction

## Implementation
```typescript
// Example: Memoize RosterItem
const MemoizedRosterItem = memo(RosterItem, (prev, next) => {
  return (
    prev.firefighter.id === next.firefighter.id &&
    prev.isSelected === next.isSelected &&
    prev.number === next.number
  );
});
```

## Impact
- Reduces unnecessary array operations
- Improves performance with 30+ firefighters
- Prevents UI lag during interactions

## Related
- Identified in PR #81 code review
- Basic memoization already applied
- Low priority but good practice
```

---

## Summary

**Total Issues:** 5
**Categories:**
- 3 Feature enhancements (search, new event, settings)
- 1 Refactor (type safety)
- 1 Performance optimization

**Estimated Effort:**
- Issue 1 (Search): 2-3 hours
- Issue 2 (New Event): 3-4 hours
- Issue 3 (Settings): 2-3 hours
- Issue 4 (Type Safety): 1-2 hours
- Issue 5 (Performance): 1-2 hours

**Total:** ~10-14 hours of development work

---

## How to Create These Issues

1. Go to https://github.com/DrunkOnJava/firefighterHub/issues/new
2. For each issue above:
   - Copy the **Title** into the title field
   - Copy the **Body** into the description field
   - Add the specified **Labels**
   - Click "Submit new issue"
3. Note down the issue numbers
4. Update PR #81 description to reference these issues
