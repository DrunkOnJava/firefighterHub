# FirefighterHub - AI Coding Agent Instructions

## Project Overview

FirefighterHub is a **shift rotation and availability management system** for fire departments. It tracks firefighters across 3 shifts (A, B, C), manages "hold" rotations (who's unavailable), tracks apparatus certifications, and maintains a complete audit trail via activity logs.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase (PostgreSQL + Real-time)
**Package Manager:** pnpm
**Testing:** Vitest + React Testing Library + Playwright

## Critical Architecture Patterns

### 1. Shift-Based Data Isolation

**Every query MUST filter by `currentShift`**. The database has data for A/B/C shifts, but UI only shows one shift at a time:

```typescript
// ✅ CORRECT - Always include shift filter
const { data } = await supabase
  .from("firefighters")
  .select("*")
  .eq("shift", currentShift) // ← CRITICAL
  .eq("is_active", true);

// ❌ WRONG - Will leak data across shifts
const { data } = await supabase
  .from("firefighters")
  .select("*")
  .eq("is_active", true);
```

The `currentShift` state lives in `App.tsx` and flows down via props. Missing this filter causes cross-shift data contamination.

### 2. Rotation Logic System (`src/utils/rotationLogic.ts`)

Firefighters have an `order_position` field (0-indexed) that determines hold rotation order. **Core utilities:**

- `sortFirefighters()` - Sorts by order_position, available firefighters first
- `recalculatePositions()` - Normalizes positions to 0,1,2,3... (removes gaps)
- `moveToBottom()` - Moves firefighter to end of available rotation
- `assignPositions()` - Assigns sequential positions based on array order

**Critical workflow when completing a hold:**

```typescript
// In useScheduledHolds.ts:markHoldCompleted()
const otherFFs = allFirefighters.filter(
  (ff) => ff.id !== completedId && ff.is_available
);
const completedFF = { ...firefighter, order_position: otherFFs.length };
const reordered = [
  ...otherFFs.map((ff, i) => ({ ...ff, order_position: i })),
  completedFF,
];
// Update database with new positions
```

**NEVER** manually set `order_position` - always use utility functions to maintain integrity.

### 3. Real-Time Sync with Robust Error Handling

Supabase real-time subscriptions are **ENABLED** with exponential backoff retry:

**Features:**

- Auto-reconnect on connection loss (1s → 2s → 4s → 8s → 16s → 30s max delay)
- Max 10 retry attempts before giving up
- Console logging: `✅ Real-time subscription active` / `⚠️ Real-time subscription error`
- Separate channels per shift: `firefighters_${currentShift}` and `scheduled_holds_${currentShift}`

**Implementation** (`useFirefighters.ts` and `useScheduledHolds.ts`):

```typescript
const channel = supabase
  .channel(`firefighters_${currentShift}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "firefighters",
      filter: `shift=eq.${currentShift}`,
    },
    () => loadFirefighters()
  )
  .subscribe((status, err) => {
    // Handles: SUBSCRIBED, CHANNEL_ERROR, TIMED_OUT, CLOSED
    // Implements exponential backoff with max 10 retries
  });
```

**Production considerations:**

- Supabase free tier: 200 concurrent connections limit
- Each tab = 2 channels (firefighters + scheduled_holds)
- 100 simultaneous users = 200 connections (at capacity limit)
- Monitor console for connection status

### 4. Activity Logging

### 4. Activity Logging

Every mutation (add, delete, complete hold, transfer shift) MUST log to the `activity_log` table:

```typescript
await logActivity(
  firefighterName,
  "hold_completed", // action_type
  `Additional details here`, // details (optional)
  firefighterId // optional
);
```

The `logActivity()` function is in `useFirefighters.ts`. It automatically captures `shift` and `created_at`.

### 5. Database Type Safety

**All types** defined in `src/lib/supabase.ts` (auto-generated from schema via Supabase MCP):

```typescript
import { Firefighter, Shift, HoldDuration, supabase } from "../lib/supabase";
```

**Important:** Database returns ISO string dates, NOT Date objects:

```typescript
// ❌ WRONG - Will crash
const date = firefighter.last_hold_date.toLocaleDateString();

// ✅ CORRECT - Parse first
const date = firefighter.last_hold_date
  ? new Date(firefighter.last_hold_date).toLocaleDateString()
  : "Never";
```

**Environment variable handling:** URLs/keys are trimmed to remove whitespace/newlines (prevents malformed URLs with `%0A` that break WebSocket connections).

### 6. Security Model (In Transition)

**Current State:** Client-side "admin mode" using localStorage (`isAdminMode`)
**Known Issue:** This is insecure - anyone can bypass via dev tools

An **unused** but complete authentication system exists:

- `src/contexts/AuthContext.tsx` - Full Supabase Auth integration
- `src/components/LoginModal.tsx` - Login UI

The hardcoded password `VITE_ADMIN_PASSWORD` (default: "Firerescue") is intentional per legacy requirements. **When replacing admin mode:**

1. Integrate `AuthContext` provider in `App.tsx`
2. Replace `isAdminMode` checks with `isAdmin` from context
3. Apply RLS migration in `supabase/migrations/20251022_enable_rls_policies.sql`

## Database Schema

### Tables

- **firefighters** - Core roster with certifications, shift, station, `last_hold_date`, `order_position`
- **scheduled_holds** - Planned holds with `hold_date`, `status` ('scheduled'|'completed'|'skipped'), `fire_station`, `duration` ('12h'|'24h')
- **activity_log** - Audit trail with `action_type`, `details`, `firefighter_name`, `shift`

### Key Constraints

- `shift` CHECK: Must be 'A', 'B', or 'C'
- `status` ENUM: 'scheduled', 'completed', 'skipped'
- `duration` ENUM: '12h', '24h'
- RLS enabled on all tables
- Foreign keys: `scheduled_holds.firefighter_id` → `firefighters.id`

### Indexes

- `idx_firefighters_shift` - Essential for shift filtering
- `idx_firefighters_station` - Station-based queries
- `idx_scheduled_holds_shift_date` - Calendar date range queries

## Development Workflows

### Running the App

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm typecheck    # TypeScript validation (no emitting)
pnpm lint         # ESLint check
```

**Environment:** Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Testing

**Framework:** Vitest + React Testing Library + Playwright

```bash
pnpm test              # Watch mode (development)
pnpm test:run          # CI mode (single run)
pnpm test:coverage     # With coverage report
pnpm test:ui           # Interactive Vitest UI
pnpm test:e2e          # Run Playwright E2E tests
pnpm test:e2e:headed   # E2E with visible browser
```

**Test coverage highlights:**

- `rotationLogic.ts`: 100% (30 tests)
- `calendarUtils.ts`: 100% (41 tests)
- `validation.ts`: 100% (22 tests)
- Hooks: Comprehensive tests for `useScheduledHolds`, `useFirefighters`

**Mock data:** `src/test/mockData.ts` has factory functions (`createMockFirefighter`, etc.)

**Manual testing checklist:** `VERIFICATION_TEST_CHECKLIST.md` covers critical scenarios:

- Profile Modal Tests (hold history loading, infinite loop prevention)
- Real-Time Sync Tests (multi-tab editing, data synchronization)
- Timezone Bug Tests (date consistency across roster/calendar/modals)
- Calendar Tests (past date editing, modal scrolling, completed holds)
- Read-Only Mode Tests (permission enforcement, UI state)
- Regression Tests (hold workflow, add/delete, drag-and-drop)

### Database Migrations

**Apply new migrations:**

1. Open Supabase SQL Editor: [Dashboard → SQL Editor]
2. Paste migration SQL from `supabase/migrations/`
3. Run query

**Existing migrations:**

- `20251022000000_initial_schema.sql` - Core tables, indexes, RLS setup
- `20251022_fix_schema_mismatches.sql` - Adds denormalized fields, triggers
- `20251022_enable_rls_policies.sql` - Full RLS policies (not yet applied)

### Utility Scripts

Scripts in `/scripts` use `@supabase/supabase-js` directly (not the app's client):

```bash
# Example: Run utility script
pnpm dlx tsx scripts/update-all-last-hold-dates.ts
```

Scripts read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `process.env`.

### Deployment

**Platform:** Vercel (https://firefighter-hub.vercel.app)
**Auto-deploy:** Pushes to `main` branch trigger production deployment

**Pre-deployment checklist:**

```bash
pnpm typecheck  # Must pass (0 errors)
pnpm lint       # 8 warnings acceptable (unused vars in commented code)
pnpm build      # Must succeed
pnpm test:run   # All tests pass
```

## Component Patterns

### Custom Hooks Architecture

Large hooks violate SRP. Example - `useFirefighters.ts` (465 lines) handles:

- Data fetching
- All mutations (add/delete/complete/transfer/reset)
- Optimistic updates
- Activity logging
- Real-time sync

**Pattern:** Hooks implement optimistic updates for immediate UI feedback:

```typescript
// 1. Optimistic update (immediate UI feedback)
setFirefighters(prev => [...prev, newFirefighter]);

// 2. Database mutation
const { data, error } = await supabase.from('firefighters').insert(...);

// 3. On error, rollback optimistic update
if (error) {
  setFirefighters(previousState);
  showToast('Error message', 'error');
}
```

**Proposed refactor** (not implemented):

```typescript
useFirefightersData(); // Fetching + real-time
useFirefighterMutations(); // CUD operations
useActivityLog(); // Logging
```

### Modal Components

Standard modal pattern uses boolean state + callback props:

```typescript
<CompleteHoldModal
  firefighter={selectedFirefighter}
  isOpen={showCompleteHold}
  onClose={() => setShowCompleteHold(false)}
  onComplete={async (firefighter) => {
    await completeHold(firefighter.id, new Date());
    setShowCompleteHold(false);
  }}
/>
```

### Calendar Component (`src/components/Calendar.tsx`)

Displays monthly grid with scheduled/completed holds.

**Key features:**

- Click day → Modal with hold management
- Past dates: View-only unless admin mode
- Multiple holds per day: Shows first 4, "+X more" button
- Responsive: Tested mobile (375px), tablet (768px), desktop (1920px)

**Styling:**

- Day cells use `aspect-square` for proportional scaling
- Grid: `grid-cols-7` with `auto-rows-fr` for even rows
- Hold cards: Compact design with `border-l-2` color indicators

### Theming

Theme objects in `src/utils/theme.ts`, `src/utils/sidebarTheme.ts`, `src/utils/calendarTheme.ts`

Dark mode state: `isDarkMode` in `App.tsx`, persisted to localStorage

**Apply theme:**

```typescript
import { getTheme } from "../utils/theme";
const theme = getTheme(isDarkMode);
// Then use theme.background, theme.text, etc.
```

### Keyboard Shortcuts

Use `useKeyboardShortcuts` hook (see `src/hooks/useKeyboardShortcuts.ts`):

```typescript
const { shortcuts } = useKeyboardShortcuts({
  shortcuts: [
    {
      key: "k",
      ctrl: true,
      meta: true, // Cmd on macOS
      description: "Focus search",
      action: () => searchInputRef.current?.focus(),
    },
  ],
});
```

Shows `KeyboardShortcutsModal` when user presses `?`.

## Code Quality Standards

### Technical Debt Comments

The codebase uses structured comments to document known issues:

```typescript
// TECHNICAL DEBT: [description]
// CRITICAL SECURITY ISSUE: [description]
// ISSUE: [description]
// TODO: [specific action item]
```

**When you see these:** Don't remove them unless fixing the underlying issue. They're intentional markers for future work.

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- No `any` types - use proper interfaces from `src/lib/supabase.ts`
- Component props: Define interface above component
- Types are auto-generated from database schema via Supabase MCP (`pnpm types:generate`)

### Accessibility

- Use semantic HTML (`<button>` not `<div onClick>`)
- Include ARIA labels for icon buttons
- Keyboard navigation required (focus rings, Tab order)
- Screen reader announcements via `useAnnounce()` hook
- Touch targets: Minimum 44px height (WCAG accessibility)

### Tailwind Conventions

- Dark mode: `dark:` prefix for all color classes
- Responsive: Mobile-first, use `sm:`, `md:`, `lg:` breakpoints
- Common pattern: `className={isDarkMode ? 'dark-class' : 'light-class'}`

## Common Pitfalls

1. **Forgetting shift filter** → Shows all shifts' data mixed together
2. **Mutating position without recalculating** → Gaps/duplicates in rotation order
3. **Missing activity log** → Lost audit trail
4. **Not handling date strings** → Crashes when treating as Date object
5. **Using `currentShift` directly in components** → Pass via props or context
6. **Real-time subscription leaks** → Must cleanup in useEffect return function
7. **Date off-by-one bugs** → Use `formatHoldDate()` utility with UTC timezone (see `src/utils/dateUtils.ts`)
8. **Duplicate holds** → Don't create synthetic holds from `last_hold_date`

## Project-Specific Conventions

- **"Hold"** = firefighter being unavailable for their shift (NOT on-hold status)
- **Shift A/B/C** = Three rotating shifts, never intermix data
- **Station numbers** = Stored as strings (can be null)
- **Order position** = Zero-indexed rotation order (0 = next up)
- **Deactivated vs Deleted** = Soft delete (is_active=false) vs hard delete
- **Admin mode** = Client-side flag (insecure, being replaced with Supabase Auth)

## Key Files to Know

- `src/App.tsx` - Main component, manages modals, shift state, admin mode
- `src/hooks/useFirefighters.ts` - All firefighter CRUD operations + real-time sync
- `src/hooks/useScheduledHolds.ts` - Scheduled holds management + real-time sync
- `src/utils/rotationLogic.ts` - Position calculation logic (critical for holds, 100% test coverage)
- `src/utils/calendarUtils.ts` - Date handling utilities (100% test coverage, prevents timezone bugs)
- `src/utils/dateUtils.ts` - UTC date formatting (`formatHoldDate()` utility)
- `src/lib/supabase.ts` - Type definitions (auto-generated), Supabase client
- `supabase/migrations/` - Database schema evolution
- `TODO.md` - Task list with progress tracking (currently 87.5% complete for active sprint)

## Known Issues & Technical Debt

### Data Quality (Resolved)

- ✅ Duplicate 2024 holds: FIXED (deleted 31 duplicate entries)
- ✅ Environment variables: FIXED (corrected Supabase credentials, trim whitespace)
- ✅ Calendar layout: FIXED (responsive scaling working across all devices)

### Historical Data Limitations

- Past holds before 10/22/2025 use firefighter's current station
- Historical station transfers not tracked (no time-series data)

### Security (In Progress)

- Client-side admin mode: Insecure, can be bypassed via dev tools
- Migration path: Integrate `AuthContext` + `LoginModal` (already built, unused)
- RLS policies: Defined but not yet applied (`supabase/migrations/20251022_enable_rls_policies.sql`)

### Large Hooks (Technical Debt)

- `useFirefighters.ts`: 465 lines (handles fetching + all mutations + logging + real-time)
- `useScheduledHolds.ts`: 446 lines (similar multi-responsibility pattern)
- Consider splitting into separate concerns when refactoring

## Recent Production Fixes (Oct 29, 2025)

All critical bugs fixed and deployed:

1. ✅ 72-hour validation changed from BLOCKING to WARNING-ONLY
2. ✅ Completing hold now correctly moves member to bottom of rotation
3. ✅ Last hold date updates fixed (date format, error throwing, logging)
4. ✅ Date off-by-one bug fixed with `formatHoldDate()` UTC utility
5. ✅ Duplicate holds removed from profiles

See `TODO.md` for full deployment checklist and verification steps.

## Important File Locations

- `src/lib/supabase.ts` - Type definitions + Supabase client (trim env vars to prevent %0A in URLs)
- `src/lib/database.types.ts` - Auto-generated types from database schema
- `src/test/setup.ts` - Vitest test environment configuration
- `src/test/mockData.ts` - Factory functions for test data
- `supabase/migrations/` - Database schema evolution (apply manually via SQL Editor)
- `supabase/functions/` - Edge functions (calendar subscription, schedule validation)
- `scripts/` - Utility scripts for data management (run via `pnpm dlx tsx`)
- `VERIFICATION_TEST_CHECKLIST.md` - Manual testing scenarios
- `ENV_FIXES_SUMMARY.md` - Environment variable and data cleanup documentation

---

**Questions?** Check the extensive inline comments in source files - most complex logic has detailed TECHNICAL DEBT annotations explaining "why" behind decisions. See `CLAUDE.md` for additional context and Claude-specific guidance.
