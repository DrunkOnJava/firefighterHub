# FirefighterHub - Technology Stack & Architecture

**Last Updated:** November 9, 2025
**Version:** 1.0.0

---

## Platform & Infrastructure

### Hosting & Deployment
- **Platform:** [Vercel](https://vercel.com)
- **Production URL:** https://firefighter-hub.vercel.app
- **Auto-Deploy:** Enabled on `main` branch pushes
- **Build Command:** `pnpm build`
- **Framework Preset:** Vite (Static Site)

### Backend & Database
- **BaaS Provider:** [Supabase](https://supabase.com)
- **Database:** PostgreSQL 14
- **Real-time:** Supabase Realtime (WebSocket subscriptions)
- **Storage:** Supabase Storage (S3-compatible)
- **Authentication:** Not currently used (BC Mode uses localStorage)
- **Project URL:** https://tjljndzodowpohusrwhs.supabase.co

### Domain & DNS
- **Custom Domain:** Not yet configured
- **DNS Provider:** TBD

---

## Frontend Stack

### Core Framework
- **Library:** React 18.3.1
- **Language:** TypeScript 5.5.3
- **Build Tool:** Vite 5.4.2
- **Package Manager:** pnpm (NOT npm)
- **Node Version:** 20.19.5 (managed via Volta)

### UI Framework & Styling
- **CSS Framework:** Tailwind CSS 3.4.1
- **Component Library:** shadcn/ui 3.5.0 (based on Radix UI)
- **Icons:** Lucide React 0.344.0
- **Animations:** tailwindcss-animate 1.0.7
- **Class Management:** clsx 2.1.1, tailwind-merge 3.3.1
- **Theme System:** next-themes 0.4.6 (dark/light mode)

### Radix UI Primitives (via shadcn)
- `@radix-ui/react-dialog` - Modals
- `@radix-ui/react-dropdown-menu` - Dropdowns
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-select` - Select inputs
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-separator` - Dividers
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-toast` - Toast notifications

### Calendar & Date Handling
- **Primary:** Custom calendar implementation (`src/components/calendar/`)
- **Date Library:** date-fns 4.1.0
- **Picker:** react-day-picker 9.11.1 (shadcn calendar)
- **Alternative (unused):** FullCalendar 6.1.19 (kept for potential future use)

### State Management
- **Pattern:** React Hooks + Local State
- **No global state library** (Redux, Zustand, etc.)
- **Data Fetching:** Custom hooks (`useFirefighters`, `useScheduledHolds`)
- **Real-time Sync:** Supabase Realtime subscriptions

---

## Backend Stack

### Database Schema
**Tables:**
- `firefighters` - Roster with order_position, shift, certifications
- `scheduled_holds` - Planned holds with status tracking
- `activity_log` - Audit trail for all actions + error logging

**Key Features:**
- Row Level Security (RLS) defined but not enabled
- Foreign keys with cascade deletes
- Indexed on shift and date columns
- Supports A/B/C shift isolation

### Edge Functions (Supabase)
- **Runtime:** Deno
- **Functions:**
  - `hold-schedule-calendar` - iCalendar generation (not integrated)
  - `schedule-hold` - Server-side hold validation (in use)

---

## Development Tools

### Testing
- **Unit Tests:** Vitest 4.0.6
- **E2E Tests:** Playwright 1.56.1
- **Testing Library:** @testing-library/react 16.3.0
- **Coverage:** @vitest/coverage-v8 4.0.4
- **Test UI:** Vitest UI (interactive test runner)

**Coverage:**
- `rotationLogic.ts`: 100% (30 tests)
- `calendarUtils.ts`: 100% (41 tests)
- `validation.ts`: 100% (22 tests)

### Code Quality
- **Linter:** ESLint 9.9.1
- **Formatter:** Prettier 3.2.4
- **Type Checker:** TypeScript strict mode
- **Pre-commit:** Manual (no Husky configured)

### Build Tools
- **Bundler:** Vite 5.4.2
- **Transpiler:** Vite's esbuild
- **CSS Processor:** PostCSS 8.4.35 + Autoprefixer 10.4.18
- **Image Optimization:** Sharp 0.34.4 (PWA icon generation)

---

## Monitoring & Analytics

### Error Tracking
- **Custom System:** `src/utils/errorReporting.ts`
- **Destinations:**
  - Browser console (enhanced formatting)
  - Supabase activity_log table
  - LocalStorage (last 50 errors)
  - Vercel Analytics
  - Sentry (optional, if DSN configured)

### Analytics
- **Provider:** Vercel Analytics 1.5.0
- **Events Tracked:**
  - Page views
  - Error events
  - Custom tracking (via `track()` function)

### Logging
- **Client-side:**
  - Console logging (development)
  - LocalStorage error logs (debugging)
  - Supabase activity_log (audit trail)
- **Server-side:**
  - Vercel deployment logs
  - Supabase PostgreSQL logs
  - Vercel function logs (if applicable)

---

## Progressive Web App (PWA)

### Service Worker
- **Status:** Registered and active
- **Caching Strategy:** TBD
- **Offline Support:** Partial

### Manifest
- **Location:** `/manifest.json`
- **Icons:** Generated via `scripts/generate-pwa-icons.sh`
- **Sizes:** 144x144, 192x192 (located at `/icon-{size}x{size}.png`)

---

## Security & Environment

### Environment Variables
**Client-side (VITE_*):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anonymous key

**Server-side (Scripts only):**
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access for migrations

**Storage (Vercel):**
- `SUPABASE_STORAGE_*` - S3 credentials for file uploads
- Total: 18 environment variables configured

### Security Measures
- Environment variables never committed (`.env.local` in .gitignore)
- Service role key only used in backend scripts
- Anon key safe for client-side (RLS would protect if enabled)
- HTTPS enforced on Vercel deployment

---

## File Structure & Organization

```
src/
├── components/         # React components
│   ├── calendar/      # Calendar-specific components
│   ├── mobile/        # Mobile-optimized views
│   ├── tablet/        # Tablet layouts
│   ├── roster/        # Roster table components
│   └── ui/            # shadcn/ui primitives
├── hooks/             # Custom React hooks
│   ├── useFirefighters.ts
│   ├── useScheduledHolds.ts
│   └── useActivityLogger.ts
├── utils/             # Helper functions
│   ├── rotationLogic.ts
│   ├── calendarUtils.ts
│   ├── errorReporting.ts  # ⭐ New error tracking
│   └── validation.ts
├── lib/               # Third-party configurations
│   └── supabase.ts    # Supabase client + types
├── test/              # Test utilities and mocks
└── styles/            # CSS and design tokens

supabase/
├── functions/         # Edge functions (Deno)
└── migrations/        # Database schema evolution

scripts/               # Utility scripts (run with tsx)
├── delete-2024-holds.ts
├── insert-hold-data.ts
└── update-all-last-hold-dates.ts
```

---

## Development Workflow

### Local Development
```bash
pnpm dev              # Start Vite dev server (port 5173/5174)
pnpm typecheck        # TypeScript validation
pnpm lint             # ESLint check
pnpm test             # Vitest watch mode
pnpm test:e2e:headed  # Playwright with browser
```

### Pre-deployment Checklist
```bash
pnpm typecheck        # ✅ Must pass
pnpm lint             # ⚠️ 8 warnings acceptable
pnpm build            # ✅ Must succeed
pnpm test:run         # ✅ All tests pass
```

### Deployment Process
1. Push to `main` branch
2. Vercel auto-deploys (triggers on git push)
3. Build runs on Vercel servers
4. Environment variables auto-injected
5. Deployment URL provided in Vercel dashboard

---

## Third-Party Dependencies

### Core Dependencies (16 packages)
- React ecosystem (react, react-dom)
- Supabase client (@supabase/supabase-js)
- Radix UI primitives (8 packages)
- Tailwind utilities (class-variance-authority, clsx, tailwind-merge)
- Date handling (date-fns, react-day-picker)
- Icons (lucide-react)
- Notifications (sonner)
- Analytics (@vercel/analytics)
- Theming (next-themes)

### Dev Dependencies (22 packages)
- Build tools (Vite, TypeScript, PostCSS)
- Testing (Vitest, Playwright, Testing Library)
- Linting (ESLint, Prettier)
- Types (@types/react, @types/node)
- Database utilities (pg for scripts)

### Notable Libraries
- **No jQuery** - Modern React approach
- **No Axios** - Using native fetch API
- **No Lodash** - ES6+ features + custom utilities
- **No Moment.js** - date-fns is smaller and tree-shakeable

---

## Performance Characteristics

### Bundle Size
- **Estimated:** ~2.1MB initial load (development)
- **Optimizations:**
  - Lazy loading for modals
  - Code splitting via dynamic imports
  - Tree-shaking enabled
  - Vite's automatic chunk splitting

### Load Times (Localhost)
- **Initial:** ~130 network requests
- **Supabase Queries:** 4-6 concurrent (optimized)
- **Cold start:** < 2 seconds
- **Hot reload:** < 500ms (Vite HMR)

### Real-time Performance
- **Subscription Latency:** < 100ms (Supabase WebSocket)
- **Auto-reconnect:** Exponential backoff (1s → 30s max)
- **Max Retries:** 10 attempts before giving up

---

## Browser Support

### Minimum Requirements
- **Chrome/Edge:** v90+ (2021)
- **Firefox:** v88+ (2021)
- **Safari:** v14+ (2020)
- **Mobile Safari:** iOS 14+ (2020)

### Feature Detection
- CSS Grid (97.8% support)
- CSS Custom Properties (97.1%)
- Flexbox (99.7%)
- fetch API (98.6%)
- WebSockets (97.8%)

### Progressive Enhancement
- Service Worker (offline support)
- Touch gestures (mobile calendar)
- Dark mode (system preference detection)

---

## Architecture Patterns

### Component Patterns
- **Composition:** Small, focused components
- **Prop Drilling:** Used for currentShift (no Context API needed)
- **Custom Hooks:** Data fetching separated from UI
- **Error Boundaries:** Wrap lazy-loaded sections

### Data Flow
1. **App.tsx** - Root state (shift, admin mode)
2. **Custom Hooks** - Data fetching + mutations
3. **Components** - Receive data via props
4. **Supabase** - Real-time sync via subscriptions

### State Management Philosophy
- **Local state** for UI (modals, filters)
- **Custom hooks** for server state
- **No Redux/Zustand** - React hooks are sufficient
- **Optimistic updates** for better UX

---

## Key Technical Decisions

### Why Vite over Create React App?
- Faster dev server (esbuild vs Webpack)
- Better HMR performance
- Smaller bundle sizes
- Native ESM support

### Why Supabase over Firebase?
- PostgreSQL (relational data model)
- Real-time subscriptions included
- Better pricing for small projects
- Open source (can self-host)

### Why shadcn/ui over Material-UI?
- Smaller bundle size
- Copy-paste components (no package dependency)
- Full Tailwind integration
- More customizable styling

### Why pnpm over npm?
- Faster install times (symlinked node_modules)
- Disk space efficient
- Strict dependency resolution

---

## Optional Integrations (Not Currently Used)

### Error Tracking
- **Sentry:** Add `VITE_SENTRY_DSN` to enable
- **Installation:** `pnpm add @sentry/react`

### CI/CD
- **GitHub Actions:** Not configured (using Vercel auto-deploy)
- **Pre-commit Hooks:** Not configured (manual checks)

### Additional Services
- **Email:** Not configured (could use Supabase Auth + email templates)
- **SMS:** Not configured (could integrate Twilio for hold notifications)
- **Push Notifications:** Not configured (PWA ready, needs service worker update)

---

## Local Development Setup

### Prerequisites
```bash
# Required
Node.js 20.19.5 (via Volta or mise)
pnpm 9.x
Git

# Optional
Supabase CLI (for local database)
Playwright browsers (for E2E tests)
```

### Installation
```bash
# Clone repo
git clone <repo-url>
cd firefighterHub

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# Start dev server
pnpm dev
```

### Environment Configuration
**Required in `.env.local`:**
```bash
VITE_SUPABASE_URL=https://tjljndzodowpohusrwhs.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**Optional:**
```bash
SUPABASE_SERVICE_ROLE_KEY=<for-scripts-only>
VITE_SENTRY_DSN=<if-using-sentry>
```

---

## Production Deployment

### Current Setup
- **Automatic:** Push to `main` → Vercel builds and deploys
- **Build Time:** ~45-60 seconds
- **Environment:** Vercel injects 18 environment variables
- **SSL:** Automatic via Vercel (Let's Encrypt)

### Deployment Checklist
1. Run `pnpm typecheck` (must pass)
2. Run `pnpm lint` (8 warnings acceptable)
3. Run `pnpm build` (must succeed)
4. Run `pnpm test:run` (all tests pass)
5. Push to `main` branch
6. Monitor Vercel dashboard for deployment status
7. Test production URL after deployment

---

## Monitoring & Observability

### Error Tracking (Production)
**Built-in System (Active):**
- ✅ Browser console logs
- ✅ Supabase activity_log entries
- ✅ LocalStorage error cache (last 50)
- ✅ Vercel Analytics events
- ⏳ Sentry integration (optional, requires setup)

**Error Report Contents:**
- Timestamp and session ID
- Error message and stack trace
- Component and action context
- User agent and viewport size
- URL and environment (dev/prod)

### Performance Monitoring
- **Vercel Analytics:** Basic metrics (page views, errors)
- **Browser DevTools:** Lighthouse audits
- **Real-time Status:** Console logs show connection state

### Logs Locations
1. **Client-side:**
   - Browser DevTools Console
   - LocalStorage: `firefighterhub_error_log` key
   - Download via "Download Error Logs" button

2. **Server-side:**
   - Vercel deployment logs (dashboard)
   - Supabase PostgreSQL logs (dashboard)
   - Supabase activity_log table (queryable)

3. **Analytics:**
   - Vercel Analytics dashboard
   - (Optional) Sentry dashboard

---

## Architecture Diagrams

### Data Flow
```
User Action
    ↓
React Component
    ↓
Custom Hook (useFirefighters/useScheduledHolds)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase REST API (PostgreSQL)
    ↓
Database Update
    ↓
Real-time Subscription (WebSocket)
    ↓
Custom Hook (listener)
    ↓
React Component Re-render
```

### Error Reporting Flow
```
Error Occurs
    ↓
ErrorBoundary.componentDidCatch()
    ↓
reportError() utility
    ├─→ Console (enhanced formatting)
    ├─→ LocalStorage (debugging cache)
    ├─→ Supabase activity_log (audit)
    ├─→ Vercel Analytics (production tracking)
    └─→ Sentry (optional)
    ↓
Toast Notification (user feedback)
```

### Hold Completion Flow
```
User clicks "Complete Hold"
    ↓
CompleteHoldModal opens
    ↓
User confirms (selects date/station)
    ↓
useScheduledHoldsMutations.markHoldCompleted()
    ├─→ Update scheduled_holds.status = 'completed'
    ├─→ Update firefighter.last_hold_date
    ├─→ Recalculate all order_positions
    └─→ Log to activity_log
    ↓
Optimistic UI update
    ↓
Supabase Real-time notification
    ↓
All clients update automatically
```

---

## API Integrations

### Supabase REST API
- **Base URL:** `https://tjljndzodowpohusrwhs.supabase.co/rest/v1/`
- **Authentication:** `apikey` header with anon key
- **Format:** JSON
- **Operations:**
  - GET /firefighters?shift=eq.A
  - POST /scheduled_holds
  - PATCH /firefighters?id=eq.<uuid>
  - DELETE /scheduled_holds?id=eq.<uuid>

### Supabase Realtime
- **Protocol:** WebSocket
- **Channels:**
  - `firefighters_A`, `firefighters_B`, `firefighters_C`
  - `scheduled_holds_A`, `scheduled_holds_B`, `scheduled_holds_C`
- **Events:** INSERT, UPDATE, DELETE
- **Filters:** Server-side filtering by shift

### Vercel Analytics
- **API:** Automatic via `@vercel/analytics/react`
- **Events:** Custom tracking via `track()` function
- **Privacy:** GDPR compliant

---

## Migration Path & Future Enhancements

### Potential Upgrades
- [ ] Real authentication (Supabase Auth + Magic Links)
- [ ] Push notifications (Service Worker updates)
- [ ] SMS alerts (Twilio integration for hold reminders)
- [ ] Email reports (scheduled via Edge Functions)
- [ ] Mobile apps (React Native or Progressive Web App)
- [ ] Offline-first (IndexedDB sync)

### Current Limitations
- No offline support beyond service worker
- No mobile native apps
- Client-side admin mode (intentional)
- No email/SMS notifications
- Historical data tracking limited

---

## Support & Documentation

### Resources
- **Main Docs:** CLAUDE.md (project instructions)
- **Audit Report:** AUDIT_REPORT_2025-11-09.md
- **Tech Stack:** This file (TECH_STACK.md)
- **Environment:** ENV_FIXES_SUMMARY.md

### Getting Help
1. Check console for error logs
2. Download error logs via ErrorBoundary
3. Review CLAUDE.md for common issues
4. Submit issue with error report attached

---

## Summary

**FirefighterHub** is a modern, responsive web application built with:
- **Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Realtime + Storage)
- **Hosting:** Vercel (auto-deploy, edge network, analytics)
- **Monitoring:** Custom error tracking + Vercel Analytics

**Architecture Philosophy:**
- Simple > Complex (no over-engineering)
- Fast > Feature-rich (Vite for speed)
- Type-safe > Flexible (TypeScript strict mode)
- Reactive > Polling (Real-time subscriptions)
- Convenient > Secure (soft credential check for volunteer use case)

**Total Package Count:** 38 dependencies (16 prod + 22 dev)
**Total Bundle Size:** ~2.1MB (uncompressed dev)
**Database Tables:** 3 (firefighters, scheduled_holds, activity_log)
**Supported Shifts:** A, B, C (fully isolated)
