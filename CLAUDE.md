# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: FirefighterHub

Shift rotation and availability management system for fire departments. Tracks firefighters across A/B/C shifts, manages hold rotations, apparatus certifications, and maintains complete audit trails.

**Tech:** React 18 + TypeScript + Vite + Tailwind + Supabase (PostgreSQL + Real-time + Auth)

## Development Commands

**⚠️ IMPORTANT: Use MCP server tools instead of terminal commands when available (see MCP Server Tools section below).**

```bash
# Development
pnpm dev              # Start dev server (localhost:5173, may use 5174 if 5173 in use)
pnpm build            # Production build
pnpm typecheck        # TypeScript validation
pnpm lint             # ESLint check

# Testing
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run tests once
pnpm test:coverage    # Generate coverage report
pnpm test:ui          # Open interactive Vitest UI
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:headed  # Run E2E tests with visible browser

# Database Scripts (use tsx)
pnpm dlx tsx scripts/<script-name>.ts
```

## MCP Server Tools (⚠️ USE THESE FIRST)

**ALWAYS prefer MCP server tools over terminal commands.** MCP (Model Context Protocol) servers provide structured, type-safe interfaces.

### Available MCP Servers

1. **GitHub MCP** (`mcp_github_*`) - Git operations, commits, PRs, issues, file management
2. **Chrome DevTools MCP** (`mcp_chromedevtool_*`) - Browser automation, E2E testing, screenshots
3. **Microsoft Playwright MCP** (`mcp_microsoft_pla_browser_*`) - Advanced browser testing
4. **Upstash Context7 MCP** (`mcp_upstash_conte_*`) - Library documentation lookup

### When to Ask for New MCP Servers

**If a task would be more effective with an MCP server that's not available, STOP and ask:**

> "This task would be better handled with an MCP server for [service]. Would you like me to recommend installing one? It would replace terminal commands with structured tools."

**Candidates:** Database clients (Supabase, PostgreSQL), Cloud services (Vercel, AWS), Package managers (pnpm), CI/CD, monitoring services.

### Usage Rules

1. ✅ **Always check for MCP tools first** before using terminal
2. ✅ **Use GitHub MCP** for all git operations (don't use `git` commands)
3. ✅ **Use browser MCP** for E2E testing (don't use `playwright` CLI)
4. ✅ **Parallelize independent MCP calls** for efficiency
5. ❌ **Only use terminal for:** Package scripts (`pnpm dev`), simple checks (`ls`, `cat`), SQL migrations

## Critical Architecture Patterns

### 1. Shift-Based Data Isolation

**EVERY database query MUST filter by `currentShift`**. Data exists for A/B/C shifts but UI only shows one at a time:

```typescript
// ✅ CORRECT
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', currentShift)  // ← CRITICAL: Always include
  .eq('is_active', true);

// ❌ WRONG - Will leak data across shifts
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('is_active', true);
```

The `currentShift` state lives in `App.tsx` and flows down via props. Missing this filter causes cross-shift data contamination.

### 2. Rotation Logic System

Firefighters have an `order_position` field (0-indexed) that determines hold rotation order.

**Core utilities** (`src/utils/rotationLogic.ts`):
- `sortFirefighters()` - Sorts by order_position, available firefighters first
- `recalculatePositions()` - Normalizes positions to 0,1,2,3... (removes gaps)
- `moveToBottom()` - Moves firefighter to end of available rotation
- `assignPositions()` - Assigns sequential positions based on array order

**Critical workflow when completing a hold:**

```typescript
// In useScheduledHolds.ts markHoldCompleted()
const otherFFs = allFirefighters.filter(ff => ff.id !== completedId && ff.is_available);
const completedFF = { ...firefighter, order_position: otherFFs.length };
const reordered = [...otherFFs.map((ff, i) => ({...ff, order_position: i})), completedFF];
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
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'firefighters',
    filter: `shift=eq.${currentShift}`
  }, () => loadFirefighters())
  .subscribe((status, err) => {
    // Handles: SUBSCRIBED, CHANNEL_ERROR, TIMED_OUT, CLOSED
    // Implements exponential backoff with max 10 retries
  });
```

**Monitor console for:**
- `✅ Connection status: CONNECTED` - All good
- `⚠️ Real-time subscription error: CHANNEL_ERROR` - Retrying
- `❌ Max retries reached` - Connection failed

### 4. Database Type Definitions

**All types** defined in `src/lib/supabase.ts`:

```typescript
import { Firefighter, Shift, HoldDuration, supabase } from '../lib/supabase';
```

**Important:** Database returns ISO string dates, NOT Date objects:

```typescript
// ❌ WRONG - Will crash
const date = firefighter.last_hold_date.toLocaleDateString();

// ✅ CORRECT - Parse first
const date = firefighter.last_hold_date
  ? new Date(firefighter.last_hold_date).toLocaleDateString()
  : 'Never';
```

### 5. Activity Logging (Audit Trail)

**EVERY mutation must log to `activity_log` table:**

```typescript
await logActivity(
  firefighterName,
  'hold_completed',        // action_type
  'Moved to position 5',   // details (optional)
  firefighterId            // optional
);
```

Function is in `useFirefighters.ts`. Auto-captures `shift` and `created_at`.

## Database Schema

### Tables
- **firefighters** - Roster with `order_position`, `shift`, `last_hold_date`, apparatus certifications
- **scheduled_holds** - Planned holds with `hold_date`, `status`, `fire_station`, `duration`, `start_time`
- **activity_log** - Audit trail with `action_type`, `details`, `firefighter_name`

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

## Component Architecture

### State Management Pattern

**Global state** (in `App.tsx`):
- `currentShift` - A/B/C selector
- `isDarkMode` - Theme (persisted to localStorage)
- `isAdminMode` - Edit permissions (currently client-side boolean, being migrated to Supabase Auth)

**Data fetching hooks:**
- `useFirefighters(showToast, currentShift)` - Returns firefighters + all mutation functions
- `useScheduledHolds(showToast, currentShift)` - Returns holds + scheduling functions

**Pattern:** Hooks handle optimistic updates:

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

### Calendar Component (`src/components/Calendar.tsx`)

Displays monthly grid with scheduled/completed holds.

**Key features:**
- Click day → Modal with hold management
- Past dates: View-only unless admin mode
- Multiple holds per day: Shows first 4, "+X more" button
- Responsive: Tested mobile (375px), tablet (768px), desktop (1920px)

**Styling (Updated Nov 4, 2025):**
- Main container: `bg-white dark:bg-slate-800` with `rounded-xl shadow-sm border`
- Grid uses `gap-px` with slate borders to create visual separation
- Day cells: `min-h-[120px] bg-white dark:bg-slate-800` with hover states
- Today indicator: Red ring (`ring-2 ring-red-500 ring-inset`) + red badge on day number
- Weekday headers: `bg-slate-50 dark:bg-slate-800`
- Out-of-month days: `opacity-40` for visual hierarchy

### Hold Completion Flow

**Critical:** When marking hold complete, must update both tables:

1. Update `scheduled_holds.status = 'completed'`
2. Move firefighter to bottom of rotation
3. Update `firefighters.order_position` for ALL shift members
4. Update `firefighters.last_hold_date` for completed firefighter

See `useScheduledHolds.ts:markHoldCompleted()` for reference implementation (lines 321-415).

## Color System & Design Tokens

**Location:** `src/styles/colorSystem.ts` and `src/styles/tokens.ts`

### Color Palette Organization

The color system uses a **hybrid approach** with clear usage rules:

1. **GRAY palette** → Structural elements (backgrounds, containers, borders)
2. **SLATE palette** → Interactive elements (buttons, inputs, hover states)
3. **SEMANTIC colors** → Contextual meaning (red=danger, blue=scheduled, emerald=success)

### Accent Color (Added Nov 4, 2025)

A **red-to-orange gradient** has been documented for future use as an accent color:

```tsx
import { colors } from '@/styles';

// Use accent gradient for primary actions
<button className={`${colors.semantic.accent.gradient} ${colors.semantic.accent.hover} ${colors.semantic.accent.shadow}`}>
  Create Vacancy
</button>

// Or use directly
<button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg">
  Action
</button>
```

**Use cases:** Primary action buttons, call-to-action elements, navigation active states, important notifications.

**Documentation:** See `docs/ACCENT_COLORS.md` for full guidelines.

## Environment Variables

**Required** (`.env.local`):
```bash
VITE_SUPABASE_URL=https://tjljndzodowpohusrwhs.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # For scripts only
```

**Vercel** (all environments):
- 18 total environment variables configured
- Includes: VITE_*, SUPABASE_*, POSTGRES_*, SUPABASE_STORAGE_*
- Storage S3 credentials configured for file uploads

**Security:** Never commit `.env.local` - use `.env.example` as template

## Deployment

**Platform:** Vercel (https://firefighter-hub.vercel.app)
**Auto-deploy:** Pushes to `main` branch trigger production deployment

**Pre-deployment checklist:**
```bash
pnpm typecheck  # Must pass
pnpm lint       # 8 warnings acceptable
pnpm build      # Must succeed
pnpm test:run   # All tests pass
```

**Vercel environment variables:** Already configured via CLI, no manual setup needed

## Common Pitfalls & Solutions

### 1. Shift Filter Missing
**Problem:** Query returns data from all shifts
**Solution:** Always include `.eq('shift', currentShift)`

### 2. Position Gaps After Mutation
**Problem:** Positions become 0, 2, 5, 7 (gaps)
**Solution:** Call `recalculatePositions()` after any reordering

### 3. Date Type Confusion
**Problem:** Database returns strings, code treats as Date
**Solution:** Parse with `new Date(dateString)` before using Date methods

### 4. Missing Activity Log
**Problem:** Changes aren't auditable
**Solution:** Call `logActivity()` after every mutation

### 5. Real-Time Subscription Leaks
**Problem:** Subscriptions stay active after component unmount
**Solution:** Return cleanup function in useEffect:
```typescript
return () => {
  if (channel) supabase.removeChannel(channel);
};
```

## Testing

**Framework:** Vitest + React Testing Library + Playwright

**Run tests:**
```bash
pnpm test              # Watch mode (development)
pnpm test:run          # CI mode (single run)
pnpm test:coverage     # With coverage report
pnpm test:e2e:headed   # E2E with visible browser
```

**Test coverage:**
- `rotationLogic.ts`: 100% (30 tests)
- `calendarUtils.ts`: 100% (41 tests)
- `validation.ts`: 100% (22 tests)
- Hooks: Comprehensive tests for useScheduledHolds, useFirefighters

**Mock data:** `src/test/mockData.ts` has factory functions (`createMockFirefighter`, etc.)

## Known Issues & Technical Debt

### Data Quality Issues (Resolved)
- ✅ Duplicate 2024 holds: FIXED (deleted 31 duplicate entries via `scripts/delete-2024-holds.ts`)
- ✅ Environment variables: FIXED (corrected Supabase project credentials)
- ✅ Calendar layout: FIXED (responsive scaling working across all devices)

### Historical Data Limitations
- Past holds before 10/22/2025 use firefighter's current station (historical station transfers not tracked)
- No way to retroactively determine which station they were at on past dates without time-series data

### Security (In Progress)
- Client-side admin mode: Insecure, can be bypassed
- Migration path: Integrate `AuthContext` + `LoginModal` (already built, unused)
- RLS policies: Defined but not yet applied (`supabase/migrations/20251022_enable_rls_policies.sql`)

### Large Hooks
- `useFirefighters.ts`: 468 lines (handles fetching + all mutations + logging)
- `useScheduledHolds.ts`: 446 lines (similar multi-responsibility pattern)
- Consider splitting into separate concerns when refactoring

## Edge Functions

**Location:** `supabase/functions/`

**`hold-schedule-calendar`** - iCalendar generation for hold schedules
- Not yet integrated with main app
- Requires Deno runtime
- Uses service_role key for auth

**`schedule-hold`** - Server-side hold scheduling with validation
- Called from `useScheduledHolds.ts:scheduleHold()`
- Validates business rules before inserting
- Uses session token or anon key for auth

## Utility Scripts

**Location:** `scripts/`

All scripts use `@supabase/supabase-js` with service role key. Run via:

```bash
pnpm dlx tsx scripts/<name>.ts
```

**Common scripts:**
- `delete-2024-holds.ts` - Cleanup duplicate year data
- `insert-hold-data.ts` - Backfill A/C shift historical holds
- `insert-b-shift-holds.ts` - Backfill B shift historical holds
- `update-all-last-hold-dates.ts` - Sync last_hold_date from scheduled_holds
- `verify-database.ts` - Database integrity checks

**Note:** Scripts must hardcode credentials or use environment variables (dotenv not configured)

## Project-Specific Terminology

- **"Hold"** = Firefighter being unavailable/off for their shift (NOT "on hold" status)
- **Shift A/B/C** = Three rotating crews, data completely isolated
- **Station** = Fire station number (stored as string, can be null)
- **Order position** = Zero-indexed rotation order (0 = next up for hold)
- **Deactivated** = Soft delete (`is_active = false`), not hard deleted
- **Admin mode** = Edit permissions (currently client-side flag)

## Mobile-First Responsive Design

Calendar day cells tested across:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

Uses Tailwind responsive prefixes: `text-xs sm:text-sm lg:text-base`

Touch targets: Minimum 44px height (WCAG accessibility)

## Important File Locations

- `src/lib/supabase.ts` - Type definitions + Supabase client (trim() env vars to prevent %0A in URLs)
- `src/utils/rotationLogic.ts` - Position calculation (100% test coverage, critical for holds)
- `src/utils/calendarUtils.ts` - Date handling (100% coverage, prevents timezone bugs)
- `src/hooks/useFirefighters.ts` - All firefighter CRUD + real-time subscription
- `src/hooks/useScheduledHolds.ts` - Hold scheduling + completion + real-time subscription
- `supabase/migrations/` - Database schema evolution (apply manually via SQL Editor)
- `ENV_FIXES_SUMMARY.md` - Recent environment variable and data cleanup documentation
