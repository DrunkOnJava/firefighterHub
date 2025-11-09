# FirefighterHub - Technology Stack Overview

## Platform & Tech Stack

### 🏗️ **Frontend**
```
React 18.3.1 + TypeScript 5.5.3
├── Build Tool: Vite 5.4.2
├── UI Framework: shadcn/ui (Radix UI primitives)
├── Styling: Tailwind CSS 3.4.1
├── Icons: Lucide React
└── Theme: next-themes (dark/light mode)
```

### 🗄️ **Backend**
```
Supabase (Backend-as-a-Service)
├── Database: PostgreSQL 14
├── Real-time: WebSocket subscriptions
├── Storage: S3-compatible object storage
└── Edge Functions: Deno runtime (optional)
```

### 🚀 **Hosting & Deployment**
```
Vercel
├── Auto-deploy: main branch → production
├── Build: Automatic on git push
├── SSL: Automatic (Let's Encrypt)
├── Analytics: Built-in
└── Edge Network: Global CDN
```

### 📊 **Monitoring & Error Tracking**
```
Error Reporting System (Custom + Sentry)
├── Sentry: Real-time error monitoring + session replay
├── Vercel Analytics: Error events + page views
├── Supabase: activity_log table (audit trail)
└── LocalStorage: Client-side error cache
```

---

## Architecture Pattern

**Type:** Single Page Application (SPA)
**Data Flow:** Unidirectional (React + custom hooks)
**State Management:** React Hooks (no Redux/Zustand)
**API:** RESTful (Supabase REST API)
**Real-time:** WebSocket (Supabase Realtime)

---

## Key Technologies Breakdown

### React Ecosystem
- **React 18.3.1** - Core UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool & dev server
- **React DOM 18.3.1** - DOM rendering

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **shadcn/ui 3.5.0** - Component library (copy-paste, not installed)
- **Radix UI** - Accessible primitives (16 packages)
- **Lucide React 0.344.0** - Icon library
- **next-themes 0.4.6** - Dark/light mode

### Data & Backend
- **@supabase/supabase-js 2.57.4** - Supabase client
- **date-fns 4.1.0** - Date manipulation
- **PostgreSQL 14** - Database (via Supabase)

### Testing
- **Vitest 4.0.6** - Unit tests
- **Playwright 1.56.1** - E2E tests
- **@testing-library/react 16.3.0** - Component testing

### Error Monitoring
- **@sentry/react 10.23.0** - Error tracking
- **@vercel/analytics 1.5.0** - Analytics
- **sonner 2.0.7** - Toast notifications

---

## Data Persistence

### Primary Database (Supabase PostgreSQL)
```
firefighters table
  ├── id (uuid, primary key)
  ├── name (text)
  ├── shift (A|B|C)
  ├── order_position (integer)
  ├── last_hold_date (date)
  ├── fire_station (text)
  ├── is_active (boolean)
  └── certifications (jsonb)

scheduled_holds table
  ├── id (uuid, primary key)
  ├── firefighter_id (foreign key)
  ├── hold_date (date)
  ├── status (scheduled|completed|skipped)
  ├── shift (A|B|C)
  └── fire_station (text)

activity_log table
  ├── id (uuid, primary key)
  ├── firefighter_id (uuid, nullable)
  ├── action_type (text) ← "error" for error reports
  ├── description (text)
  ├── details (text) ← JSON-formatted error data
  └── created_at (timestamp)
```

### Client-side Storage
```
LocalStorage
├── battalionChiefAuth → "true" | null
├── firefighterhub_error_log → ErrorReport[] (last 50)
├── theme → "dark" | "light"
└── filters → (various UI filters)

SessionStorage
└── firefighterhub_session_id → Unique session identifier
```

---

## Development Tools

### Package Manager
- **pnpm** (NOT npm)
- Symlinked node_modules for disk efficiency
- Strict dependency resolution

### Code Quality
- **ESLint 9.9.1** - Linting
- **Prettier 3.2.4** - Formatting
- **TypeScript strict mode** - Type checking

### Testing Infrastructure
```bash
pnpm test              # Vitest (unit tests)
pnpm test:e2e          # Playwright (E2E tests)
pnpm test:coverage     # Coverage report
pnpm test:ui           # Interactive test UI
```

---

## Deployment Pipeline

```
Local Development
    ↓
git push origin main
    ↓
Vercel detects push
    ↓
Vercel runs: pnpm install && pnpm build
    ↓
Vite builds production bundle
    ↓
Vercel deploys to edge network
    ↓
Production URL live: firefighter-hub.vercel.app
```

**Build Time:** ~45-60 seconds
**Deploy Time:** ~10-15 seconds
**Total:** ~1 minute from push to live

---

## Environment Variables (18 total)

### Client-side (Vite)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`

### Server-side (Scripts)
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_*` (7 variables for direct DB access)
- `SUPABASE_STORAGE_*` (4 variables for S3)

---

## Real-time Architecture

### Supabase Realtime Channels
```typescript
Channel: firefighters_A
  ├── Event: INSERT → Reload firefighters
  ├── Event: UPDATE → Reload firefighters
  └── Event: DELETE → Reload firefighters

Channel: scheduled_holds_A
  ├── Event: INSERT → Reload holds
  ├── Event: UPDATE → Reload holds
  └── Event: DELETE → Reload holds
```

**Connection Management:**
- Auto-reconnect with exponential backoff
- Max 10 retry attempts
- 1s → 2s → 4s → 8s → 16s → 30s delay
- Toast notification on reconnect

---

## Browser Support

**Tested & Working:**
- ✅ Chrome 90+ (Chromium)
- ✅ Firefox 88+
- ✅ Safari 14+ (macOS)
- ✅ Mobile Safari iOS 14+
- ✅ Edge 90+

**Responsive Breakpoints:**
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

---

## Security Model

### Battalion Chief Mode
**Type:** Soft credential check (NOT secure authentication)
**Password:** "Firerescue"
**Storage:** localStorage
**Purpose:** Prevent accidental edits (convenience, not security)

**Why no real auth?**
- Volunteer fire department
- Data is public within department
- No PII or sensitive information
- Goal is convenience, not security

**Implementation:** See `App.tsx` lines 68-86 for detailed explanation

---

## Performance Metrics

### Bundle Size (Development)
- **Initial Load:** ~2.1MB (uncompressed)
- **Network Requests:** ~130 on first load
- **Lazy Loading:** Modals loaded on-demand

### Database Performance
- **Query Time:** ~50-100ms (Supabase REST API)
- **Real-time Latency:** < 100ms (WebSocket)
- **Optimistic Updates:** Immediate UI feedback

### Error Reporting Overhead
- **Console:** Negligible (< 1ms)
- **LocalStorage:** < 1ms
- **Async Operations:** ~100-200ms total (non-blocking)

---

## Notable Design Decisions

1. **No Redux/Zustand** - React hooks are sufficient for this app size
2. **Custom calendar** - More control than FullCalendar (which is also installed but unused)
3. **Supabase over Firebase** - PostgreSQL relational model fits roster data better
4. **shadcn/ui over MUI** - Smaller bundle, more customizable
5. **pnpm over npm** - Faster, disk-efficient, stricter
6. **Vite over CRA** - 10-100x faster dev server
7. **Client-side BC Mode** - Intentional (no sensitive data)

---

## Summary

**FirefighterHub** runs on a modern, production-ready stack:

- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Realtime + Storage)
- **Hosting:** Vercel (auto-deploy, edge network, SSL)
- **Monitoring:** Sentry + Vercel Analytics + custom error reporting
- **Testing:** Vitest + Playwright + 100% coverage on core utils

**Total Dependencies:** 38 (16 production + 22 development)
**Build Tool:** Vite (fast HMR, optimized bundles)
**Database Tables:** 3 (firefighters, scheduled_holds, activity_log)
**Deployment:** Automatic (push to main → live in ~1 minute)
**Error Tracking:** 6 destinations (console, Supabase, Sentry, Vercel, localStorage, toast)

**Philosophy:** Simple > Complex, Fast > Feature-rich, Type-safe > Flexible
