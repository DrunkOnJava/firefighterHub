
# FirefighterHub - AI Coding Agent Instructions

## Project Overview

FirefighterHub is a **shift rotation and availability management system** for fire departments. It tracks firefighters across 3 shifts (A, B, C), manages "hold" rotations (unavailability periods), tracks apparatus certifications, and maintains a complete audit trail via activity logs.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase (PostgreSQL + Real-time)  
**Package Manager:** pnpm (required - not npm/yarn)  
**Testing:** Vitest + React Testing Library + Playwright  
**Node:** 20.19.5 (managed via volta/mise)

## Critical Architecture Patterns

### 1. Shift-Based Data Isolation (⚠️ CRITICAL)

**Every Supabase query MUST filter by `currentShift`**. The database contains data for all shifts (A/B/C), but the UI only displays one shift at a time:

```typescript
// ✅ CORRECT - Always include shift filter
const { data } = await supabase
  .from("firefighters")
  .select("*")
  .eq("shift", currentShift) // ← CRITICAL: Missing this leaks cross-shift data
  .eq("is_active", true);

// ❌ WRONG - Will show mixed data from all shifts
const { data } = await supabase
  .from("firefighters")
  .select("*")
  .eq("is_active", true);
```

**Why:** `currentShift` state lives in `App.tsx` and flows down via props. Missing this filter causes data contamination between shifts that looks correct visually but corrupts rotation order and hold tracking.

### 2. Rotation Logic System (`src/utils/rotationLogic.ts`)

Firefighters have an `order_position` field (0-indexed) that determines hold rotation order. **NEVER manually set positions** - always use utility functions:

- `sortFirefighters()` - Sorts by position, available firefighters first
- `recalculatePositions()` - Normalizes positions to 0,1,2,3... (removes gaps)
- `moveToBottom()` - Moves firefighter to end of available rotation
- `assignPositions()` - Assigns sequential positions based on array order

**Critical workflow when completing a hold** (`useScheduledHolds.ts`):

```typescript
// 1. Filter out completed firefighter from available list
const otherFFs = allFirefighters.filter(
  (ff) => ff.id !== completedId && ff.is_available
);

// 2. Place completed firefighter at bottom with new position
const completedFF = { ...firefighter, order_position: otherFFs.length };

// 3. Reorder all firefighters with sequential positions
const reordered = [
  ...otherFFs.map((ff, i) => ({ ...ff, order_position: i })),
  completedFF,
];

// 4. Batch update database with new positions
```

**Common bug:** Calling `recalculatePositions()` after `moveToBottom()` overwrites the intended position change. Trust the utility functions.

### 3. Real-Time Sync with Exponential Backoff

Supabase real-time subscriptions are **ENABLED** with robust error handling:

**Features:**
- Auto-reconnect on connection loss (1s → 2s → 4s → 8s → 16s → 30s max delay)
- Max 10 retry attempts before giving up
- Console logging: `✅ Real-time subscription active` / `⚠️ Real-time subscription error`
- Separate channels per shift: `firefighters_${currentShift}`, `scheduled_holds_${currentShift}`

**Implementation pattern** (see `useFirefighters.ts` lines 67-120):

```typescript
const channel = supabase
  .channel(`firefighters_${currentShift}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'firefighters',
    filter: `shift=eq.${currentShift}`,
  }, () => loadFirefighters())
  .subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Real-time subscription active');
    } else if (status === 'CHANNEL_ERROR') {
      // Exponential backoff retry logic
    }
  });

// CRITICAL: Clean up on unmount
return () => { 
  if (isSubscribed) {
    supabase.removeChannel(channel);
  }
};
```

**Production limits:**
- Supabase free tier: 200 concurrent connections
- Each tab = 2 channels (firefighters + scheduled_holds)
- 100 simultaneous users = 200 connections (at capacity)

### 4. Activity Logging (Audit Trail)

Every mutation MUST log to `activity_log` table. The `logActivity()` function is in `useFirefighters.ts`:

```typescript
await logActivity(
  firefighterName,
  "hold_completed", // action_type: 'hold_completed' | 'added' | 'deleted' | 'transferred' | 'reactivated'
  `Moved to position ${newPosition}`, // details (optional)
  firefighterId // optional
);
```

Auto-captures: `shift`, `created_at`. Missing logs = lost audit trail and compliance risk.

### 5. Database Type Safety & Date Handling

**All types** defined in `src/lib/supabase.ts` (auto-generated from schema):

```typescript
import { Firefighter, Shift, HoldDuration, supabase } from "../lib/supabase";
```

**CRITICAL: Dates are ISO strings, NOT Date objects:**

```typescript
// ❌ WRONG - Will crash at runtime
const date = firefighter.last_hold_date.toLocaleDateString();

// ✅ CORRECT - Parse ISO string first
const date = firefighter.last_hold_date
  ? new Date(firefighter.last_hold_date).toLocaleDateString()
  : "Never";

// ✅ BEST: Use formatHoldDate() utility to avoid timezone bugs
import { formatHoldDate } from "../utils/dateUtils";
const date = formatHoldDate(firefighter.last_hold_date); // "Oct 29, 2025"
```

**Why `formatHoldDate()` matters:** Database stores dates as `YYYY-MM-DD` (no time). JavaScript parses as UTC midnight. Converting to local time can shift to previous day. The utility forces UTC display to match storage.

**Environment variables:** URLs/keys are trimmed in `src/lib/supabase.ts` to remove `%0A` newlines that break WebSocket connections.

### 6. Optimistic Updates Pattern

Hooks implement **optimistic updates** for immediate UI feedback:

```typescript
// 1. Optimistic update (instant UI feedback)
setFirefighters(prev => [...prev, newFirefighter]);

// 2. Database mutation
const { data, error } = await supabase.from('firefighters').insert(...);

// 3. Rollback on error
if (error) {
  setFirefighters(previousState); // Restore original state
  showToast('Error message', 'error');
}
```

**Found in:** `useFirefighters.ts` (845 lines), `useScheduledHolds.ts` (477 lines). Both violate Single Responsibility Principle - each handles fetching, mutations, logging, and real-time sync. See TECHNICAL DEBT comments for proposed refactoring.

## MCP Server Tools Usage (⚠️ CRITICAL)

**ALWAYS use MCP (Model Context Protocol) server tools instead of terminal commands** when available. MCP servers provide structured, type-safe interfaces for external services.

### Available MCP Servers

1. **GitHub MCP Server** (`mcp_github_*` tools)
   - Repository operations: commits, branches, files, PRs, issues
   - Use for: Creating/updating files, checking repo status, managing PRs/issues
   - **NEVER** use `git` commands in terminal when GitHub MCP tools can do the job

2. **Chrome DevTools MCP Server** (`mcp_chromedevtool_*` tools)
   - Browser automation: navigation, screenshots, snapshots, form filling
   - Use for: E2E testing, visual verification, accessibility audits
   - **NEVER** use Playwright CLI when Chrome MCP tools can do the job

3. **Microsoft Playwright MCP Server** (`mcp_microsoft_pla_browser_*` tools)
   - Browser automation: advanced testing scenarios
   - Use for: Complex E2E testing workflows

4. **Upstash Context7 MCP Server** (`mcp_upstash_conte_*` tools)
   - Documentation retrieval for libraries/frameworks
   - Use for: Getting up-to-date API docs when implementing features

### When to Request Additional MCP Servers

**If you encounter a task that would be more effectively handled by an MCP server that's not currently available, STOP and ask the user:**

> "This task would be more effectively handled with an MCP server for [service/tool]. Would you like me to suggest installing an MCP server for [specific use case]? This would allow me to use structured tools instead of terminal commands."

**Examples of tasks that benefit from MCP servers:**
- Database operations (PostgreSQL, MySQL, Supabase)
- Cloud services (AWS, Vercel, Netlify)
- Package managers (npm, pnpm, yarn)
- CI/CD systems (GitHub Actions, CircleCI)
- Monitoring/logging services (Sentry, LogRocket)
- Design tools (Figma, Sketch)

### Best Practices

1. **Always check for MCP tools first** before falling back to terminal commands
2. **Use parallel MCP tool calls** when operations are independent (e.g., checking multiple files)
3. **Use GitHub MCP for all git operations** (commits, status, branches, file operations)
4. **Use browser MCP for all E2E testing** instead of manual Playwright commands
5. **Request documentation via MCP** instead of web searches when implementing features

### Command Line Fallback Rules

Only use terminal commands when:
- No MCP server exists for the operation
- The operation is a simple, read-only check (e.g., `ls`, `cat`, `grep` for quick verification)
- Running package scripts defined in `package.json` (e.g., `pnpm dev`, `pnpm test`)
- Running database migration scripts that require direct SQL execution

## Development Workflows

### Running the App

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm typecheck    # TypeScript validation (no emitting)
pnpm lint         # ESLint check
```

**Environment:** Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Testing Strategy

**Framework:** Vitest (unit) + Playwright (E2E)

```bash
pnpm test              # Watch mode (TDD workflow)
pnpm test:run          # CI mode (single run)
pnpm test:coverage     # With coverage report
pnpm test:ui           # Interactive Vitest UI
pnpm test:e2e          # Run Playwright E2E tests
pnpm test:e2e:headed   # E2E with visible browser
```

**Coverage highlights:**
- `rotationLogic.ts`: 100% (30 tests - critical for hold workflow)
- `calendarUtils.ts`: 100% (41 tests - prevents timezone bugs)
- `validation.ts`: 100% (22 tests - 72-hour hold validation)

**Mock data:** `src/test/mockData.ts` - Factory functions like `createMockFirefighter()`, `createMockScheduledHold()`. Use these instead of inline mocks for consistency.

**Regression tests:** `src/utils/regressionTests.test.ts` documents historical bugs with reproduction tests. Check this file when working on rotation logic or date handling.

## Database Schema

### Tables

- **firefighters** - Core roster with certifications, shift, station, `last_hold_date`, `order_position`
- **scheduled_holds** - Planned holds with `hold_date`, `status` ('scheduled'|'completed'|'skipped'), `fire_station`, `duration` ('12h'|'24h')
- **activity_log** - Audit trail with `action_type`, `details`, `firefighter_name`, `shift`

### Key Constraints

- `shift` CHECK: Must be 'A', 'B', or 'C'
- `status` ENUM: 'scheduled', 'completed', 'skipped'
- `duration` ENUM: '12h', '24h'
- Foreign keys: `scheduled_holds.firefighter_id` → `firefighters.id`

### Indexes

- `idx_firefighters_shift` - Essential for shift filtering
- `idx_firefighters_station` - Station-based queries
- `idx_scheduled_holds_shift_date` - Calendar date range queries

## Component Patterns

### Custom Hooks Architecture

Large hooks violate SRP. Example - `useFirefighters.ts` (845 lines) handles:

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

**Additional patterns:**
- `useDarkMode()` - Dark mode with localStorage persistence
- `useOperationLoading()` - Loading states for async operations
- `useKeyboardShortcuts()` - Global keyboard shortcut management
- `useAnnounce()` - Screen reader announcements for accessibility

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

## Key Files to Know

- `src/App.tsx` - Main component, manages modals and shift state
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

### Large Hooks (Technical Debt)

- `useFirefighters.ts`: 845 lines (handles fetching + all mutations + logging + real-time)
- `useScheduledHolds.ts`: 477 lines (similar multi-responsibility pattern)
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
