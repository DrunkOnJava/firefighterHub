# 🔥 FIREFIGHTERHUB - ZERO-SHOT PROJECT CREATION PROMPT

**Complete Guide for Recreating This Production Application**

---

## PART 1: PROJECT OVERVIEW & TECHNICAL STACK

### Project Overview

**FirefighterHub** is a visually stunning, production-ready shift rotation and availability management system for fire departments. This is a mission-critical application that tracks firefighter availability across rotating shifts, manages mandatory "hold" rotations (when firefighters cover shifts for unavailable personnel), tracks apparatus certifications, and maintains a complete audit trail.

**Core Purpose**: Fire departments operate on 3 rotating shifts (A, B, C). When firefighters are unavailable, others must "hold" (cover) their shift. This app manages who's next in the rotation, schedules holds in advance, tracks completion, and ensures fair distribution of mandatory coverage.

---

## TECHNICAL STACK (Non-Negotiable)

### Frontend

- **Framework**: React 18.3.1 with TypeScript (strict mode)
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1 with custom design token system
- **State Management**: React hooks (no Redux/Zustand)
- **Icons**: Lucide React (lucide-react)
- **Package Manager**: pnpm

### Backend & Database

- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase Real-time subscriptions (with exponential backoff retry)
- **Authentication**: Supabase Auth (email/password for battalion chiefs)
- **Storage**: Supabase Storage (for future file uploads)

### Testing & Quality

- **Unit Tests**: Vitest 4.0.4 + React Testing Library
- **E2E Tests**: Playwright 1.56.1
- **Coverage**: @vitest/coverage-v8
- **Linting**: ESLint 9.9.1 + typescript-eslint
- **Type Checking**: TypeScript 5.5.3

### PWA & Deployment

- **Progressive Web App**: Full PWA with service worker, offline capability
- **Manifest**: Complete manifest.json with 8 icon sizes (72px → 512px)
- **Deployment**: Vercel (optimized for production)
- **Cache Strategy**: Aggressive caching with version-based invalidation

---

## CRITICAL ARCHITECTURE PATTERNS

### 1. **SHIFT-BASED DATA ISOLATION** (Mission Critical)

Every single database query MUST filter by `currentShift`. Data for shifts A, B, and C exists simultaneously in the database, but the UI only shows ONE shift at a time.

```typescript
// ALWAYS include shift filter - this is non-negotiable
const { data } = await supabase
  .from("firefighters")
  .select("*")
  .eq("shift", currentShift) // ← CRITICAL: Missing this causes data leaks
  .eq("is_active", true);
```

### 2. **ROTATION LOGIC SYSTEM** (`src/utils/rotationLogic.ts`)

Firefighters have an `order_position` field (integer, 0-indexed) determining hold rotation order.

**Core Rules**:

- Available firefighters sorted by `order_position` (ascending)
- Unavailable firefighters pushed to bottom (sorted separately)
- When completing a hold: `moveToBottom()` moves firefighter to max position + 1
- After position changes: `recalculatePositions()` normalizes gaps (0, 1, 2, 3...)
- **NEVER manually set positions** - always use utility functions

**Functions**:

- `sortFirefighters()` - Sorts by availability, then order_position
- `recalculatePositions()` - Normalizes position gaps
- `moveToBottom()` - Moves completed firefighter to end
- `assignPositions()` - Assigns sequential positions (0, 1, 2...)

### 3. **REAL-TIME SYNC WITH ERROR HANDLING** (Re-enabled October 2025)

Supabase real-time subscriptions are ENABLED with robust error handling:

**Features**:

- ✅ Exponential backoff retry (1s → 2s → 4s → 8s → 16s → 30s max)
- ✅ Automatic reconnection on connection loss
- ✅ Channel-specific subscriptions per shift (`firefighters_${currentShift}`)
- ✅ Graceful cleanup on component unmount
- ✅ Console logging for connection status

**Implementation Pattern**:

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
    (payload) => {
      loadFirefighters(); // Re-fetch data on any change
    }
  )
  .subscribe((status, err) => {
    if (status === "SUBSCRIBED") {
      console.log("✅ Real-time subscription active");
    } else if (status === "CHANNEL_ERROR") {
      // Implement exponential backoff retry
    }
  });
```

**Production Consideration**: Supabase free tier = 200 concurrent connections. Each browser tab = 2 channels (firefighters + scheduled_holds). 100 users = 200 connections (at limit).

### 4. **ACTIVITY LOGGING** (Audit Trail - Required by Fire Department)

Every mutation MUST create an `activity_log` entry:

```typescript
await logActivity(
  firefighterName,
  "hold_completed", // action_type
  `Completed 24h hold at Station 3`, // details (optional)
  firefighterId // optional
);
```

**Log Action Types**:

- `firefighter_added`, `firefighter_deleted`, `firefighter_deactivated`, `firefighter_reactivated`
- `hold_scheduled`, `hold_completed`, `hold_skipped`, `hold_cancelled`
- `shift_transferred`, `bulk_deleted`, `bulk_deactivated`
- `rotation_reset`, `master_reset`

### 5. **DESIGN TOKEN SYSTEM** (Comprehensive, 1,029 lines)

A complete design system prevents CSS chaos:

**Spacing Tokens** (reduced 30% from original):

- Card padding: `p-3`, `p-4`, `p-5`, `p-6`
- Modal padding: `p-4`, `p-5`, `p-6`, `p-8`
- Gaps: `gap-1` through `gap-6`
- Margins: `mb-2` through `mb-6`

**Color System**:

- **Gray palette** → Structural (backgrounds, borders, text)
- **Slate palette** → Interactive (buttons, inputs, hover)
- **Semantic colors** → Status (red/danger, blue/scheduled, green/success, orange/warning)
- **Component presets** → Pre-configured color combos for consistency

**Typography**:

- Headings: H1 (2xl, bold) through H5 (sm, semibold)
- Body: primary, secondary, small, large
- Font weights: light (300) through bold (700)

**Other Systems**:

- Border radius, shadow elevation, transitions, z-index layering

---

## DATABASE SCHEMA

### Tables & Key Fields

**firefighters** (Core roster):

```sql
- id: UUID (primary key)
- name: TEXT (required)
- shift: TEXT (A, B, or C - required)
- station: TEXT (nullable)
- order_position: INTEGER (rotation order, default 0)
- is_available: BOOLEAN (default true)
- is_active: BOOLEAN (soft delete, default true)
- last_hold_date: DATE (nullable, ISO format YYYY-MM-DD)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ

-- Apparatus Certifications (boolean flags)
- cert_ambulance: BOOLEAN
- cert_engine: BOOLEAN
- cert_truck: BOOLEAN
- cert_tanker: BOOLEAN
- cert_rescue: BOOLEAN
- cert_brush: BOOLEAN
```

**scheduled_holds** (Planned holds):

```sql
- id: UUID (primary key)
- firefighter_id: UUID (FK to firefighters)
- hold_date: DATE (required, ISO format)
- status: TEXT ('scheduled', 'completed', 'skipped')
- station: TEXT (nullable, station they held AT)
- duration: TEXT ('12h' or '24h', default '24h')
- start_time: TEXT (nullable, e.g., '0600' or '1800')
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ (nullable)
```

**activity_log** (Audit trail):

```sql
- id: UUID (primary key)
- shift: TEXT (A, B, or C - denormalized for filtering)
- firefighter_name: TEXT (denormalized, survives deletes)
- firefighter_id: UUID (nullable, null if firefighter deleted)
- action_type: TEXT (see section 4 for types)
- details: TEXT (nullable, additional context)
- created_at: TIMESTAMPTZ
```

### Indexes (Performance)

```sql
CREATE INDEX idx_firefighters_shift_active ON firefighters(shift, is_active);
CREATE INDEX idx_firefighters_order ON firefighters(order_position);
CREATE INDEX idx_scheduled_holds_date ON scheduled_holds(hold_date);
CREATE INDEX idx_scheduled_holds_firefighter ON scheduled_holds(firefighter_id);
CREATE INDEX idx_activity_log_shift ON activity_log(shift);
```

### Triggers

```sql
-- Auto-update updated_at timestamp on row changes
CREATE TRIGGER set_firefighters_updated_at
  BEFORE UPDATE ON firefighters ...

-- Sync hold station to firefighters table on completion
CREATE TRIGGER sync_hold_station_on_completion
  AFTER UPDATE ON scheduled_holds ...
```

---

## KEY FEATURES & BUSINESS LOGIC

### 1. **Shift Management** (A, B, C Rotations)

- 3 independent rosters (never intermix data)
- ShiftSelector component at top of UI
- Switching shifts preserves state (filters, search, view mode)
- Each shift has independent rotation order

### 2. **Hold Rotation System**

**Workflow**:

1. Battalion chief schedules hold for specific firefighter + date
2. Hold appears on calendar with "Scheduled" badge (blue)
3. When hold occurs, chief marks it "Complete"
4. System automatically:
   - Moves firefighter to bottom of rotation (`moveToBottom()`)
   - Updates `last_hold_date` to hold_date
   - Recalculates positions if needed
   - Logs activity (`hold_completed`)
5. Next firefighter in rotation moves up

**Edge Cases**:

- Can't schedule holds > 1 week in past (locked with warning icon)
- 72-hour rule: WARNING only (not blocking) if firefighter had hold < 72h ago
- Completing hold must update both `scheduled_holds.status` AND `firefighters.last_hold_date`
- Date off-by-one bug fixed: Always use `timeZone: "UTC"` when formatting dates

### 3. **Calendar View** (Refactored to 8 Sub-Components)

**Component Structure** (169 lines total, down from 910):

- `Calendar.tsx` (orchestrator, minimal state)
- `CalendarHeader.tsx` (title, month nav, shift indicator)
- `CalendarLegend.tsx` (color legend for hold statuses)
- `CalendarGrid.tsx` (7x6 grid, weekday headers)
- `DayCell.tsx` (individual day, 44px min touch target)
- `DayModal.tsx` (modal for selected day, focus trap)
- `HoldList.tsx` (displays holds for selected day, action buttons)
- `HoldForm.tsx` (schedule new hold, firefighter picker)

**Visual States**:

- Empty day: Light gray background
- Today: Orange border (`border-orange-500`)
- Scheduled hold: Blue dot badge
- Completed hold: Green dot badge
- Both: Split blue/green badge

### 4. **Firefighter Roster** (FirefighterList.tsx)

**Display Columns**:

- Name (with availability indicator)
- Station (nullable)
- Last Hold Date (formatted with UTC timezone)
- Apparatus Certifications (icon badges)
- Actions (profile, complete hold, delete/deactivate)

**Removed Features** (per user feedback Oct 29, 2025):

- ❌ Hours Worked column (can't accurately calculate without scheduling system)
- ❌ Top Firefighter metric (removed from reports)

**Bulk Actions**:

- Select all / Deselect all
- Bulk delete (with confirmation)
- Bulk deactivate (soft delete)

### 5. **Admin Mode vs View-Only Mode**

**Admin Mode** (Battalion Chiefs):

- Full CRUD operations
- Schedule/complete/cancel holds
- Add/delete/deactivate firefighters
- Transfer firefighters between shifts
- Reset rotation order
- Access reports/analytics
- View activity log

**View-Only Mode** (Firefighters):

- View calendar (read-only)
- View roster (read-only)
- View their own profile
- ❌ No edit buttons
- ❌ No reports access (hidden per user request)
- ❌ No activity log access

**Authentication**:

- Uses Supabase Auth (email/password)
- `profiles` table with `is_admin` boolean
- `AuthContext` provides `user`, `isAdmin`, `signIn()`, `signOut()`
- `LoginModal` for authentication flow

---

## VISUAL DESIGN REQUIREMENTS

### Color Scheme (Dark Mode Primary, Light Mode Secondary)

**Dark Mode Palette**:

- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Border: `#334155` (slate-700)
- Text primary: `#f1f5f9` (slate-100)
- Text secondary: `#cbd5e1` (slate-300)
- Accent: `#ea580c` (orange-600)

**Light Mode Palette**:

- Background: `#ffffff`
- Surface: `#f8fafc` (slate-50)
- Border: `#e2e8f0` (slate-200)
- Text primary: `#0f172a` (slate-900)
- Text secondary: `#475569` (slate-600)
- Accent: `#ea580c` (orange-600)

**Semantic Colors**:

- Success: `#10b981` (green-500)
- Warning: `#f59e0b` (amber-500)
- Danger: `#ef4444` (red-500)
- Info: `#3b82f6` (blue-500)
- Scheduled: `#60a5fa` (blue-400)
- Completed: `#34d399` (green-400)

### Typography

- **Font Family**: System font stack (SF Pro on macOS, Segoe UI on Windows)
- **Base Size**: 16px
- **Scale**: 12px (xs) → 14px (sm) → 16px (base) → 18px (lg) → 20px (xl) → 24px (2xl)
- **Line Height**: 1.5 (body), 1.2 (headings)

### Spacing & Layout

- **Container Max Width**: 1440px (desktop)
- **Sidebar Width**: 320px (desktop), full screen (mobile)
- **Card Padding**: 12px (p-3) → 16px (p-4) → 20px (p-5) → 24px (p-6)
- **Gap Between Elements**: 4px (gap-1) → 16px (gap-4)
- **Touch Targets**: Minimum 44x44px (WCAG 2.1 AA)

### Animations & Transitions

- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: `ease-in-out` (default), `ease-out` (enter), `ease-in` (exit)
- **Applied To**: Hover states, modal open/close, tab switches, toast notifications

---

## COMPONENT ARCHITECTURE & PATTERNS

### Core Components (50+ files in `src/components/`)

**Layout Components**:

- `Header.tsx` - App title, dark mode toggle, admin/view-only indicator
- `Sidebar.tsx` - Navigation (Calendar, Reports), Team Status, Upcoming Holds, Who's Next rotation
- `MobileNav.tsx` - Mobile hamburger menu with bottom sheet navigation
- `ShiftSelector.tsx` - A/B/C shift tabs with visual indicator
- `Breadcrumb.tsx` - Navigation breadcrumbs for deep views

**Calendar Components** (Refactored Architecture):

- `Calendar.tsx` - Orchestrator (169 lines)
- `calendar/CalendarHeader.tsx` - Month navigation
- `calendar/CalendarLegend.tsx` - Status color legend
- `calendar/CalendarGrid.tsx` - 7x6 day grid
- `calendar/DayCell.tsx` - Individual day cell (44px min touch)
- `calendar/DayModal.tsx` - Day detail modal with focus trap
- `calendar/HoldList.tsx` - List of holds for selected day
- `calendar/HoldForm.tsx` - Schedule new hold form

**Roster Components** (Modular Architecture):

- `FirefighterList.tsx` - Main roster view (orchestrator)
- `roster/RosterHeader.tsx` - Title, add button, export menu
- `roster/RosterSearchBar.tsx` - Search with keyboard shortcut (Cmd+K)
- `roster/BulkActions.tsx` - Select all, bulk delete/deactivate
- `roster/FirefighterCard.tsx` - Individual firefighter card
- `roster/CertificationBadges.tsx` - Apparatus cert icons

**Modal Components**:

- `QuickAddFirefighterModal.tsx` - Add firefighter form
- `FirefighterProfileModal.tsx` - Full profile with hold history, edit form
- `CompleteHoldModal.tsx` - Mark hold as complete
- `TransferShiftModal.tsx` - Move firefighter between shifts
- `ActivityLogModal.tsx` - View audit trail
- `HelpModal.tsx` - User guide and help content
- `KeyboardShortcutsModal.tsx` - Keyboard shortcuts reference
- `LoginModal.tsx` - Supabase authentication
- `ConfirmDialog.tsx` - Non-blocking async confirmation (3 variants: danger/warning/info)

**UI Components** (Reusable):

- `ui/Button.tsx` - Primary, secondary, danger variants
- `ui/Input.tsx` - Text input with validation states
- `ui/Select.tsx` - Dropdown with keyboard navigation
- `ui/Checkbox.tsx` - Checkbox with label
- `ui/Modal.tsx` - Base modal with overlay and focus trap
- `ui/Toast.tsx` - Toast notification system (success/error/warning/info)
- `ui/Tooltip.tsx` - Hover tooltips with delay
- `ui/EmptyState.tsx` - Empty state illustrations
- `ui/SkeletonLoader.tsx` - Loading placeholders
- `ui/LoadingButton.tsx` - Button with loading spinner

**Other Components**:

- `Reports.tsx` - Analytics dashboard (admin only)
- `ErrorBoundary.tsx` - Error handling boundary
- `UpdateNotification.tsx` - Service worker update prompt
- `ConnectionStatusIndicator.tsx` - Real-time connection status

### Custom Hooks (Critical Business Logic)

**`useFirefighters.ts`** (468 lines - TECHNICAL DEBT: Needs refactoring):

- `firefighters` - Current shift roster (filtered, sorted)
- `deactivatedFirefighters` - Soft-deleted firefighters
- `loading` - Loading state
- `addFirefighter()` - Create new firefighter
- `updateFirefighter()` - Update firefighter details
- `deleteFirefighter()` - Hard delete (with confirmation)
- `deactivateFirefighter()` - Soft delete (with confirmation)
- `reactivateFirefighter()` - Restore soft-deleted
- `completeHold()` - Mark hold complete, move to bottom, update last_hold_date
- `transferShift()` - Move firefighter to different shift
- `resetRotation()` - Recalculate all positions
- `masterReset()` - DANGER: Delete all data (double confirmation)
- `logActivity()` - Create activity log entry

**`useScheduledHolds.ts`** (350+ lines):

- `scheduledHolds` - All scheduled holds for current shift
- `loading` - Loading state
- `scheduleHold()` - Create new hold
- `updateHold()` - Edit hold details (date, station, duration)
- `completeHold()` - Mark as completed, update last_hold_date
- `skipHold()` - Mark as skipped (no position change)
- `cancelHold()` - Delete scheduled hold
- Real-time subscription with exponential backoff

**`useDarkMode.ts`**:

- `isDarkMode` - Current theme state
- `toggleDarkMode()` - Switch themes
- Persists to localStorage (`theme` key)

**`useToast.ts`**:

- `toasts` - Array of active toasts
- `showToast(message, type, duration)` - Display toast
- `hideToast(id)` - Dismiss toast
- Auto-dismiss after duration (default 3s)

**`useConfirm.ts`** (Non-blocking Confirmations):

- `confirm(options)` - Returns Promise<boolean>
- `confirmState` - Current confirmation dialog state
- `handleConfirm()`, `handleCancel()` - Dialog actions
- Supports 3 variants: danger, warning, info

**`useKeyboardShortcuts.ts`**:

- `shortcuts` - Array of registered shortcuts
- Registers global keyboard listeners
- Handles Cmd (macOS) vs Ctrl (Windows/Linux)
- Shows `?` to open shortcuts modal

**`useAnnounce.ts`** (Accessibility):

- `announce(message, priority)` - Screen reader announcements
- Uses ARIA live regions (polite/assertive)

### Utility Functions

**`src/utils/rotationLogic.ts`** (68 lines, 100% test coverage):

- `sortFirefighters()` - Sort by availability + position
- `recalculatePositions()` - Normalize position gaps
- `moveToBottom()` - Move firefighter to end
- `assignPositions()` - Assign sequential positions
- `formatHoldListMessage()` - Generate rotation text export

**`src/utils/calendarUtils.ts`** (300+ lines, 100% test coverage):

- `getMonthDays()` - Generate calendar grid (42 days)
- `formatDate()`, `formatDateLong()` - Date formatting with UTC
- `isSameDay()`, `isToday()`, `isPastDate()` - Date comparisons
- `getHoldsForDay()` - Filter holds by date
- `getUpcomingHolds()` - Next 5 scheduled holds
- `canEditHold()` - Check if hold is locked (> 1 week old)

**`src/utils/dateUtils.ts`** (NEW - Oct 29, 2025):

- `formatHoldDate()` - Format date with UTC timezone (fixes off-by-one bug)
- Always use `timeZone: "UTC"` to match database storage

**`src/utils/validation.ts`**:

- `validateFirefighter()` - Validate firefighter form
- `validateHold()` - Validate hold scheduling
- `check72HourRule()` - WARNING only (not blocking per user feedback)

**`src/utils/theme.ts`** (Design token system):

- `getTheme()` - Get theme object for current mode
- Theme tokens for spacing, colors, typography, shadows

**`src/utils/export.ts`**:

- `exportToCSV()` - Export roster to CSV
- `exportHoldHistory()` - Export hold data
- `exportActivityLog()` - Export audit trail
- `generateRotationMessage()` - WhatsApp/SMS text export

---

## ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA)

### Keyboard Navigation (All Interactive Elements)

**Global Shortcuts**:

- `Cmd+K` / `Ctrl+K` - Focus search bar
- `Cmd+N` / `Ctrl+N` - Quick add firefighter
- `Cmd+H` / `Ctrl+H` - Open help modal
- `Cmd+L` / `Ctrl+L` - Open activity log
- `?` - Show keyboard shortcuts modal
- `Escape` - Close current modal

**Focus Management**:

- Focus trap in modals (Tab cycles within modal)
- Focus visible indicators (orange ring: `focus:ring-2 focus:ring-orange-500`)
- Skip to main content link
- Logical tab order throughout app

### Screen Reader Support

**ARIA Labels**:

- All icon buttons have `aria-label`
- Modal dialogs have `role="dialog"` and `aria-labelledby`
- Form inputs have proper `<label>` associations
- Live regions for dynamic content (`aria-live="polite"`)

**Semantic HTML**:

- Use `<button>` not `<div onClick>`
- Use `<nav>`, `<main>`, `<aside>`, `<section>`
- Proper heading hierarchy (single `<h1>`, then `<h2>`, then `<h3>`)

**Announcements**:

- Toast notifications announced via `useAnnounce()`
- Shift changes announced
- Hold completions announced

### Color Contrast

**All text meets 4.5:1 minimum**:

- Light mode: Dark text on light backgrounds
- Dark mode: Light text on dark backgrounds
- Links: Underlined + color differentiation
- Status indicators: Icons + text (not color alone)

### Touch Targets

- Minimum 44x44px for all interactive elements
- Extra padding on mobile buttons
- Generous spacing between tap targets

---

## PROGRESSIVE WEB APP (PWA) FEATURES

### Service Worker (`public/sw.js`)

**Cache Strategy**:

- Cache-first for static assets (HTML, CSS, JS, fonts)
- Network-first for API calls (Supabase)
- Offline fallback page
- Version-based cache invalidation (`CACHE_VERSION = 'v2.1.0'`)

**Update Flow**:

1. Service worker checks for updates every 60 seconds
2. If new version detected, shows `UpdateNotification` component
3. User clicks "Update" → Hard refresh → New version loads
4. Old cache cleared automatically

**Files Cached**:

- `/` (index.html)
- `/manifest.json`
- All `/icon-*.png` files
- All compiled JS/CSS bundles

### Manifest (`public/manifest.json`)

```json
{
  "name": "Hold List Manager - Firefighter Rotation",
  "short_name": "Hold List",
  "description": "Manage firefighter mandatory hold rotation schedules",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#ea580c",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    { "src": "/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Icon Generation**:

- Source: `public/icon-512x512.png` (base icon)
- Script: `scripts/generate-pwa-icons.sh` (uses Sharp)
- Generates all 8 sizes automatically

---

## SPECIFIC USER REQUESTS & BUG FIXES (October 2025)

### Critical Production Fixes (All Deployed)

1. ✅ **72-Hour Rule Changed to Warning Only** (Oct 29, 2025)

   - User: "There is no way to accurately calculate that without manually checking through the scheduling program"
   - Fix: Changed from BLOCKING to WARNING-ONLY in `validation.ts`

2. ✅ **Completing Hold Moves to Bottom** (Oct 29, 2025)

   - User: "Member doesn't move to bottom when I complete their hold"
   - Fix: Removed `recalculatePositions()` call after `moveToBottom()` in `useScheduledHolds.ts`

3. ✅ **Last Hold Date Updates** (Oct 29, 2025)

   - User: "Last hold date not updating after completion"
   - Fix: Fixed date format (YYYY-MM-DD), added error throwing, added logging

4. ✅ **Date Off-By-One Bug** (Oct 29, 2025)

   - User: "Last hold date shows one day before the actual hold date"
   - Fix: Created `formatHoldDate()` utility with `timeZone: "UTC"` in `dateUtils.ts`

5. ✅ **Duplicate Holds in Profiles** (Oct 29, 2025)
   - User: "Some members show duplicate holds in their profile"
   - Fix: Removed synthetic hold creation from `last_hold_date` in `calendarUtils.ts`

### UI/UX Improvements (Per User Feedback)

6. ✅ **Hours Worked Column Removed** (Oct 29, 2025)

   - User: "Remove the hours worked from the rotation view"
   - Reason: Can't accurately calculate without scheduling program

7. ✅ **Reports Hidden in View-Only Mode** (Oct 29, 2025)

   - User: "Remove the analytics report from the view only mode"
   - Fix: Conditional rendering in `Sidebar.tsx` based on `isAdminMode`

8. ✅ **Enhanced Holds by Shift Visualization** (Oct 29, 2025)

   - User: "Holds by shift does not show the other 2 shifts"
   - Fix: Added visual bar charts with percentages for all 3 shifts in `Reports.tsx`

9. ✅ **Removed Top Firefighter Metric** (Oct 29, 2025)

   - User: "Remove 'Top Firefighter' from the Hold Metrics Dashboard"
   - Fix: Removed metric card, adjusted grid to 2-column layout

10. ✅ **Added Back Button to Reports** (Oct 29, 2025)
    - User: "Add a button to return to the dashboard from the Hold Metrics Dashboard"
    - Fix: Added "Back" button with ChevronLeft icon in Reports header

---

## TESTING REQUIREMENTS

### Unit Tests (Vitest + React Testing Library)

**Current Coverage**: 100% on critical utilities

**Test Files**:

- `src/utils/rotationLogic.test.ts` (30 tests)

  - Sort by availability and position
  - Recalculate positions (normalize gaps)
  - Move to bottom (completed firefighters)
  - Edge cases: Empty arrays, single item, all unavailable

- `src/utils/calendarUtils.test.ts` (41 tests)
  - Month generation (42 days, correct padding)
  - Date comparisons (same day, today, past)
  - Hold filtering by date
  - Timezone handling (UTC consistency)
  - Edit lock (> 1 week old holds)

**Test Patterns**:

```typescript
// Use mock data from src/test/mockData.ts
import { mockFirefighters, createMockHold } from "../test/mockData";

// Mock Supabase client from src/test/supabaseMock.ts
vi.mock("../lib/supabase", () => ({
  supabase: mockSupabase,
}));

// Test async confirmations
const confirmed = await confirm({
  title: "Delete?",
  variant: "danger",
});
expect(confirmed).toBe(true);
```

### E2E Tests (Playwright)

**Test Scenarios**:

- User authentication flow
- Schedule a hold → Complete → Verify position change
- Switch shifts → Verify data isolation
- Dark mode toggle → Verify persistence
- Keyboard shortcuts → Verify all work
- Mobile responsive → Verify touch targets
- Offline mode → Verify PWA cache

**Configuration** (`playwright.config.ts`):

- Browsers: Chromium, Firefox, WebKit
- Viewport: Desktop (1280x720), Mobile (375x667)
- Base URL: `http://localhost:5173`

### Manual Test Checklist (VERIFICATION_TEST_CHECKLIST.md)

- Profile modal tests (hold history loading)
- Real-time sync tests (multi-tab editing)
- Timezone bug tests (date consistency)
- Calendar tests (past date editing, modal scrolling)
- Read-only mode tests (permission enforcement)
- Regression tests (hold workflow, drag-and-drop)

---

## ENVIRONMENT SETUP

### Required Environment Variables (`.env`)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=Firerescue  # Legacy, will be removed
```

**Security Note**: Environment variables are trimmed (`.trim()`) to prevent malformed URLs with `%0A` characters that break WebSocket connections.

### Database Setup (Supabase)

1. Create Supabase project
2. Apply migrations in order:
   - `20251022000000_initial_schema.sql` - Core tables, indexes, RLS
   - `20251022_fix_schema_mismatches.sql` - Denormalized fields, triggers
   - `20251029000001_enable_rls_with_policies.sql` - Full RLS policies
   - `20251029000002_create_profiles_table.sql` - Admin profiles
   - `20251102_add_duration_start_time.sql` - Hold duration/start time fields
3. (Optional) Run `database/seed.sql` for sample data

### Development Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (http://localhost:5173)
pnpm build                # Production build
pnpm preview              # Preview production build
pnpm typecheck            # TypeScript validation
pnpm lint                 # ESLint check
pnpm test                 # Run tests in watch mode
pnpm test:coverage        # Generate coverage report
pnpm test:e2e             # Run Playwright E2E tests
pnpm generate:icons       # Generate PWA icons
```

---

## PROJECT STRUCTURE

```
firefighterHub/
├── public/
│   ├── icon-*.png                    # PWA icons (8 sizes)
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service worker
│   └── offline.html                  # Offline fallback
├── src/
│   ├── components/
│   │   ├── calendar/                 # Calendar sub-components (8 files)
│   │   ├── roster/                   # Roster sub-components (5 files)
│   │   ├── ui/                       # Reusable UI components (10 files)
│   │   └── *.tsx                     # Other components (40+ files)
│   ├── contexts/
│   │   └── AuthContext.tsx           # Supabase authentication
│   ├── hooks/
│   │   ├── useFirefighters.ts        # Firefighter CRUD + activity log
│   │   ├── useScheduledHolds.ts      # Hold scheduling + real-time
│   │   ├── useDarkMode.ts            # Theme toggle + persistence
│   │   ├── useToast.ts               # Toast notifications
│   │   ├── useConfirm.ts             # Async confirmations
│   │   └── use*.ts                   # Other custom hooks
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client + types
│   │   └── database.types.ts         # Auto-generated DB types
│   ├── utils/
│   │   ├── rotationLogic.ts          # Hold rotation algorithms
│   │   ├── calendarUtils.ts          # Calendar date logic
│   │   ├── dateUtils.ts              # Date formatting (UTC)
│   │   ├── validation.ts             # Form validation
│   │   ├── export.ts                 # CSV/text export
│   │   ├── theme.ts                  # Design token system
│   │   └── *.ts                      # Other utilities
│   ├── test/
│   │   ├── setup.ts                  # Vitest config
│   │   ├── mockData.ts               # Mock firefighters/holds
│   │   └── supabaseMock.ts           # Supabase client mock
│   ├── config/
│   │   └── constants.ts              # App constants
│   ├── App.tsx                       # Main app component
│   └── main.tsx                      # Entry point
├── supabase/
│   └── migrations/                   # Database migrations (12 files)
├── scripts/
│   ├── generate-pwa-icons.sh         # Icon generation
│   └── *.ts                          # Utility scripts
├── database/
│   ├── schema.sql                    # Full schema
│   └── seed.sql                      # Sample data
├── docs/
│   ├── ACCESSIBILITY.md              # A11y guidelines
│   └── *.md                          # Other documentation
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── vitest.config.ts
├── playwright.config.ts
└── eslint.config.js
```

---

## DEPLOYMENT (Vercel)

### Build Configuration

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

### Environment Variables (Vercel Dashboard)

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Post-Deployment Checks

1. ✅ Service worker registers successfully
2. ✅ PWA install prompt appears (Chrome address bar)
3. ✅ All icons load (no 404 errors)
4. ✅ Real-time subscriptions connect
5. ✅ Dark mode persists across page loads
6. ✅ Offline mode shows fallback page

---

## VISUAL POLISH CHECKLIST

### 🎨 Must-Have Visual Elements

- [ ] Smooth animations (150ms hover, 300ms modals)
- [ ] Glass morphism effects on cards (backdrop-blur)
- [ ] Gradient accents (orange → red on headers)
- [ ] Subtle shadows (elevation system)
- [ ] Skeleton loaders (not just spinners)
- [ ] Empty state illustrations (not just text)
- [ ] Toast notifications (slide in from top-right)
- [ ] Focus rings (orange, 2px, rounded)
- [ ] Dark mode toggle with sun/moon icon animation
- [ ] Responsive design (mobile-first, breakpoints at 640px, 768px, 1024px)

### 🔥 Extra Visual Flourishes

- [ ] Firefighter helmet icon in logo
- [ ] Flame emoji 🔥 in toast success messages
- [ ] Rotating shift indicator animation
- [ ] Hold completion confetti animation (optional)
- [ ] Smooth calendar month transitions
- [ ] Hover tooltips with 200ms delay
- [ ] Loading button spinner (inline, doesn't shift layout)
- [ ] Pulse animation on "Next up" rotation card

---

## SUCCESS CRITERIA

Your implementation is complete when:

1. ✅ **All 5 critical bug fixes** are implemented (see Section on User Requests)
2. ✅ **Shift isolation works** - No data leaks between shifts A, B, C
3. ✅ **Rotation logic correct** - Completing hold moves firefighter to bottom
4. ✅ **Dates display correctly** - No timezone off-by-one bugs
5. ✅ **Real-time sync works** - Multi-tab editing stays in sync (with reconnection)
6. ✅ **Activity log complete** - Every mutation creates audit trail
7. ✅ **Admin vs view-only** - Proper permission enforcement
8. ✅ **PWA works** - Service worker registers, icons load, offline mode works
9. ✅ **Accessibility passes** - WCAG 2.1 AA compliance
10. ✅ **Tests pass** - 100% coverage on critical utilities
11. ✅ **Visually stunning** - Dark mode looks professional, animations smooth
12. ✅ **Mobile responsive** - Works perfectly on 375px phones
13. ✅ **Production deployed** - Live on Vercel with no console errors

---

## FINAL NOTES

This is a **production-grade, mission-critical application** used by real fire departments. Code quality, data integrity, and user experience are paramount. Follow the architectural patterns strictly—they exist because they solve real problems that were discovered during months of development.

**Key Success Factors**:

- Never skip shift filtering in queries
- Always use utility functions for rotation logic
- Always log activities for audit trail
- Always format dates with UTC timezone
- Always test on both admin and view-only modes
- Always test on mobile (44px touch targets)
- Always handle loading/error states gracefully

**When in doubt**: Reference the comprehensive inline comments in the source code. Most complex logic has detailed TECHNICAL DEBT annotations explaining the "why" behind decisions.

🔥 **Build something firefighters will love using every day.** 🔥
