# Comprehensive Audit Tasks & Subtasks
**Combined Analysis from Both Audits**

**Total Tasks:** 44 Major Tasks
**Total Subtasks:** 180+ Implementation Steps
**Estimated Total Effort:** 12-15 weeks

---

## 🔴 CRITICAL PRIORITY (Must Fix Immediately)

### 1. Fix Supabase WebSocket API Key Formatting ✓ COMPLETED
**Severity:** CRITICAL - Blocks Real-time Features
**Impact:** 1106+ failed WebSocket requests, 126 console errors
**Effort:** 1 hour

**Subtasks:**
- [x] Add `.trim()` to `VITE_SUPABASE_URL` in `src/lib/supabase.ts:9`
- [x] Add `.trim()` to `VITE_SUPABASE_ANON_KEY` in `src/lib/supabase.ts:10`
- [x] Test WebSocket connection in browser console
- [x] Verify no %0A character in connection URL
- [x] Update comment documentation
- [ ] Add environment variable validation function
- [ ] Add unit test for trimmed env vars

**Files Modified:**
- `src/lib/supabase.ts`

---

### 2. Implement Maximum Retry Limit for WebSocket ✓ COMPLETED
**Severity:** CRITICAL - Prevents Infinite Loops
**Impact:** Stops 1000+ unnecessary retry attempts
**Effort:** 2 hours

**Subtasks:**
- [x] Add `MAX_RETRIES` constant (set to 10) in `useScheduledHolds.ts`
- [x] Add retry counter variable
- [x] Implement retry limit check before reconnection attempt
- [x] Add same logic to `useFirefighters.ts`
- [x] Add console error when max retries reached
- [x] Stop retry loop when limit exceeded
- [ ] Add metric tracking for retry attempts
- [ ] Log retry patterns to analytics

**Files Modified:**
- `src/hooks/useScheduledHolds.ts:61,106-112`
- `src/hooks/useFirefighters.ts:69,114-120`

---

### 3. Add User-Facing Error Notifications ✓ COMPLETED
**Severity:** CRITICAL - User Communication
**Impact:** Users unaware of connection failures
**Effort:** 3 hours

**Subtasks:**
- [x] Add toast notification on first connection failure
- [x] Implement `hasShownErrorToast` flag to prevent spam
- [x] Add user-friendly error message
- [x] Add success notification when reconnected
- [x] Add final error message when max retries exceeded
- [x] Test error message timing
- [ ] Add "Retry Now" button to toast
- [ ] Add "Dismiss" option for toast

**Toast Messages Implemented:**
```
❌ "Live updates temporarily unavailable. Calendar will refresh automatically when connection is restored."
✓ "Real-time updates reconnected"
❌ "Unable to establish live updates. Please refresh the page to try again."
```

---

### 4. Add Connection Status Indicator in UI
**Severity:** CRITICAL - User Awareness
**Impact:** Users need visual connection status
**Effort:** 8 hours

**Subtasks:**
- [ ] Design connection status component
  - [ ] Create 3 states: Connected (green), Reconnecting (yellow), Offline (red)
  - [ ] Add icons for each state
  - [ ] Design compact indicator for header
  - [ ] Design expanded tooltip on hover
- [ ] Implement `useConnectionStatus` hook
  - [ ] Track WebSocket connection state
  - [ ] Track retry attempts
  - [ ] Expose status to components
  - [ ] Add subscription to connection events
- [ ] Add status indicator to Header component
  - [ ] Position in top-right or beside shift selector
  - [ ] Make it responsive for mobile
  - [ ] Add aria-live announcements
  - [ ] Add tooltip with details
- [ ] Create ConnectionStatusIndicator component
  - [ ] Implement green dot (connected)
  - [ ] Implement yellow pulse (reconnecting)
  - [ ] Implement red dot (offline)
  - [ ] Add animation for reconnecting state
- [ ] Add manual reconnect button
- [ ] Test all connection states
- [ ] Add keyboard accessibility

**New Files:**
- `src/hooks/useConnectionStatus.ts`
- `src/components/ConnectionStatusIndicator.tsx`

**Files to Modify:**
- `src/components/Header.tsx`
- `src/App.tsx`

---

### 5. Audit Supabase Row Level Security (RLS) Policies
**Severity:** CRITICAL - Data Security
**Impact:** Prevent unauthorized data access
**Effort:** 4 hours

**Subtasks:**
- [ ] Access Supabase Dashboard RLS policies
- [ ] Review `firefighters` table policies
  - [ ] Verify users can only view their shift
  - [ ] Verify users cannot modify other shifts
  - [ ] Check insert permissions
  - [ ] Check update permissions
  - [ ] Check delete permissions
- [ ] Review `scheduled_holds` table policies
  - [ ] Verify shift-based access control
  - [ ] Check if users can delete others' holds
  - [ ] Verify date range restrictions
- [ ] Review `activity_log` table policies
  - [ ] Verify read-only for non-admins
  - [ ] Check if logs are isolated by shift
- [ ] Test policies with multiple user accounts
- [ ] Document RLS policy decisions
- [ ] Create policy test suite
- [ ] Add policy migration scripts

**Documentation:**
- [ ] Create `docs/SECURITY-RLS-POLICIES.md`
- [ ] Document each table's policies
- [ ] Add test scenarios
- [ ] Document admin vs. user permissions

---

## 🟠 HIGH PRIORITY (Fix This Month)

### 6. Add Preconnect & DNS-Prefetch Hints ✓ COMPLETED
**Effort:** 15 minutes

**Subtasks:**
- [x] Add `<link rel="preconnect">` for Supabase domain
- [x] Add `<link rel="dns-prefetch">` as fallback
- [x] Add crossorigin attribute
- [x] Test TTFB improvement
- [ ] Add preconnect for any other external domains
- [ ] Measure performance impact with Lighthouse

---

### 7. Investigate & Fix Disabled Future Dates
**Severity:** HIGH - Blocks Core Functionality
**Impact:** Cannot schedule future holds
**Effort:** 4 hours

**Subtasks:**
- [ ] Review calendar date logic in `Calendar.tsx`
  - [ ] Check `day.isCurrentMonth` logic
  - [ ] Check `day.isPast` calculation
  - [ ] Review `isAdminMode` checks
  - [ ] Find where dates are disabled
- [ ] Test admin mode activation
  - [ ] Verify admin password works
  - [ ] Check if future dates enable in admin mode
  - [ ] Test date click handlers
- [ ] Determine if bug or feature
  - [ ] Check requirements
  - [ ] Review user feedback
  - [ ] Decide on correct behavior
- [ ] Implement fix
  - [ ] Enable future dates for admins
  - [ ] Add tooltip for read-only users
  - [ ] Update button disabled logic
  - [ ] Add visual feedback (cursor styles)
- [ ] Add UI explanation
  - [ ] Tooltip: "Admin mode required"
  - [ ] Help text in modal
  - [ ] Status message for non-admins
- [ ] Test scheduling workflow end-to-end

**Files to Review:**
- `src/components/Calendar.tsx:323-327`
- `src/App.tsx:76-93` (admin mode logic)

---

### 8. Add Content-Security-Policy Header ✓ COMPLETED
**Effort:** 2 hours

**Subtasks:**
- [x] Add CSP header to `vercel.json`
- [x] Define allowed sources for scripts
- [x] Define allowed sources for styles
- [x] Define allowed sources for images
- [x] Whitelist Supabase domain for connect-src
- [x] Add WebSocket WSS protocol
- [x] Add Permissions-Policy header
- [ ] Test all features still work
- [ ] Verify no CSP errors in console
- [ ] Add CSP reporting endpoint
- [ ] Monitor CSP violations

---

### 9. Implement Comprehensive Error Logging
**Severity:** HIGH - Production Monitoring
**Impact:** Track and fix production issues
**Effort:** 1 day

**Subtasks:**
- [ ] Choose error tracking service
  - [ ] Evaluate Sentry
  - [ ] Evaluate LogRocket
  - [ ] Evaluate PostHog
  - [ ] Make selection based on needs/budget
- [ ] Install and configure Sentry (if chosen)
  - [ ] `pnpm add @sentry/react`
  - [ ] Create Sentry project
  - [ ] Get DSN key
  - [ ] Add to environment variables
- [ ] Initialize Sentry in `main.tsx`
  ```tsx
  import * as Sentry from "@sentry/react";

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN?.trim(),
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
  ```
- [ ] Add Error Boundary with Sentry
- [ ] Track WebSocket connection failures
- [ ] Track API errors
- [ ] Add breadcrumbs for user actions
- [ ] Configure source maps upload
- [ ] Set up alerts for critical errors
- [ ] Test error reporting
- [ ] Create error dashboard
- [ ] Document error categories

**New Files:**
- `src/utils/errorTracking.ts`

**Files to Modify:**
- `src/main.tsx`
- `src/components/ErrorBoundary.tsx`
- `package.json`

---

### 10. Increase Touch Targets to 44x44px ✓ COMPLETED
**Effort:** 2 hours

**Subtasks:**
- [x] Update global button minimum size in `index.css`
- [x] Update calendar date cell minimum size
- [x] Add special rules for icon-only buttons
- [ ] Audit all interactive elements
- [ ] Test on actual mobile device
- [ ] Verify with touch target checker tool
- [ ] Fix any remaining small targets

---

### 11. Optimize Calendar for Mobile Screens
**Severity:** HIGH - Mobile UX
**Impact:** Better experience for firefighters on tablets
**Effort:** 1 week

**Subtasks:**
- [ ] Analyze current mobile breakpoints
- [ ] Reduce calendar square padding on mobile
- [ ] Implement responsive font sizes
  - [ ] Scale firefighter names based on screen size
  - [ ] Reduce station number size
  - [ ] Adjust date number size
- [ ] Add horizontal scrolling option for small screens
- [ ] Implement swipe gestures for month navigation
  - [ ] Install gesture library (e.g., `react-use-gesture`)
  - [ ] Add swipe left for next month
  - [ ] Add swipe right for previous month
  - [ ] Add visual feedback during swipe
- [ ] Add collapsible sidebar on mobile
  - [ ] Hamburger menu toggle
  - [ ] Slide-in animation
  - [ ] Close on outside click
- [ ] Test on various mobile viewports
  - [ ] 375px (iPhone SE)
  - [ ] 390px (iPhone 13)
  - [ ] 428px (iPhone 13 Pro Max)
  - [ ] 360px (Android common)
- [ ] Add mobile-specific calendar view option
  - [ ] List view alternative
  - [ ] Card view for holds
  - [ ] Week view for dense information

**Files to Modify:**
- `src/components/Calendar.tsx`
- `src/components/Sidebar.tsx`
- `tailwind.config.js`

---

### 12. Create Skeleton Loading Screens ✓ COMPLETED
**Effort:** 8 hours

**Subtasks:**
- [x] Create `SkeletonLoader.tsx` component
- [x] Implement CalendarSkeleton
- [x] Implement FirefighterListSkeleton
- [x] Implement SidebarSkeleton
- [x] Implement MetricCardSkeleton
- [x] Add shimmer animation
- [ ] Replace loading spinners with skeletons
- [ ] Add skeleton for initial page load
- [ ] Test loading states
- [ ] Adjust skeleton colors for light mode

---

### 13. Design Empty State Components ✓ COMPLETED
**Effort:** 6 hours

**Subtasks:**
- [x] Create `EmptyState.tsx` base component
- [x] Implement NoFirefightersEmptyState
- [x] Implement NoScheduledHoldsEmptyState
- [x] Implement NoSearchResultsEmptyState
- [x] Implement ConnectionErrorEmptyState
- [x] Implement NoDeactivatedFirefightersEmptyState
- [x] Implement NoActivityEmptyState
- [x] Implement NoReportsDataEmptyState
- [ ] Integrate empty states into components
- [ ] Test all empty state scenarios
- [ ] Add illustrations or icons
- [ ] Test with screen readers

---

### 14. Audit Color Contrast ✓ COMPLETED
**Effort:** 4 hours

**Subtasks:**
- [x] Document WCAG AA compliant colors
- [x] Create accessible color utilities
- [x] Identify problematic gray-500/600 usage
- [x] Create `docs/ACCESSIBILITY.md`
- [ ] Run automated contrast checker
- [ ] Review all text colors in components
- [ ] Replace non-compliant colors
- [ ] Test in light mode
- [ ] Verify with color blindness simulator

---

## 🟡 MEDIUM PRIORITY (Next Quarter)

### 15. Implement React Query for Caching
**Impact:** Reduces unnecessary API calls
**Effort:** 1 week

**Subtasks:**
- [ ] Install React Query
  - [ ] `pnpm add @tanstack/react-query`
  - [ ] `pnpm add @tanstack/react-query-devtools`
- [ ] Set up QueryClient in `main.tsx`
  ```tsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  });
  ```
- [ ] Convert `useFirefighters` to React Query
  - [ ] Create `useFirefightersQuery` hook
  - [ ] Implement cache invalidation
  - [ ] Handle mutations with `useMutation`
- [ ] Convert `useScheduledHolds` to React Query
  - [ ] Create `useScheduledHoldsQuery` hook
  - [ ] Implement optimistic updates
  - [ ] Handle real-time updates
- [ ] Add React Query DevTools
- [ ] Implement prefetching for next month
- [ ] Add query invalidation on WebSocket events
- [ ] Document caching strategy
- [ ] Test cache behavior
- [ ] Monitor performance improvements

**New Files:**
- `src/hooks/queries/useFirefightersQuery.ts`
- `src/hooks/queries/useScheduledHoldsQuery.ts`
- `src/hooks/queries/queryKeys.ts`

---

### 16. Add Confirmation Dialogs for Destructive Actions
**Impact:** Prevents accidental data loss
**Effort:** 2 days

**Subtasks:**
- [ ] Create `ConfirmDialog` component (already exists!)
- [ ] Review existing `ConfirmDialog.tsx`
- [ ] Add confirmation to `deleteFirefighter`
  - [ ] Update `useConfirm` hook usage
  - [ ] Add custom message
  - [ ] Include firefighter name
- [ ] Add confirmation to `removeScheduledHold`
  - [ ] Warn about hold cancellation
  - [ ] Show affected firefighter
  - [ ] Include date information
- [ ] Add confirmation to `deactivateFirefighter`
  - [ ] Explain history preservation
  - [ ] Show current position
- [ ] Add confirmation to `resetAll`
  - [ ] Strong warning message
  - [ ] Require typing "DELETE" to confirm
- [ ] Add confirmation to `masterReset`
  - [ ] Double confirmation required
  - [ ] List all data that will be deleted
- [ ] Add confirmation to `transferShift`
  - [ ] Explain rotation impact
  - [ ] Show from/to shift
- [ ] Test all confirmation flows
- [ ] Add keyboard shortcuts (Enter/Escape)

**Files to Modify:**
- `src/hooks/useFirefighters.ts`
- `src/hooks/useScheduledHolds.ts`
- `src/components/ConfirmDialog.tsx`

---

### 17. Implement Station Number Search Filter
**Impact:** Better roster filtering
**Effort:** 4 hours

**Subtasks:**
- [ ] Review current search implementation in `FirefighterList.tsx`
- [ ] Update search logic to include `fire_station`
  ```tsx
  const filtered = firefighters.filter(ff =>
    ff.name.toLowerCase().includes(search.toLowerCase()) ||
    (ff.fire_station && ff.fire_station.includes(search))
  );
  ```
- [ ] Add search hint text
  - [ ] "Search by name or station number"
  - [ ] Update placeholder
- [ ] Test search with station numbers
  - [ ] Search "#10" should find all Station 10
  - [ ] Search "10" should also work
  - [ ] Partial matches should work
- [ ] Add search result categorization
  - [ ] Show "Found by name: 5"
  - [ ] Show "Found by station: 3"
- [ ] Update result count message
- [ ] Add station badge highlighting in results

---

### 18. Fix Add Firefighter Button Visibility
**Impact:** User confusion about adding personnel
**Effort:** 2 hours

**Subtasks:**
- [ ] Locate "Add Firefighter" UI in code
- [ ] Check if hidden behind admin mode
  - [ ] Review `QuickAddFirefighterModal` usage
  - [ ] Check header button visibility
  - [ ] Review mobile nav menu
- [ ] If admin-only:
  - [ ] Add tooltip explaining requirement
  - [ ] Show disabled button with explanation
  - [ ] Add help text in onboarding
- [ ] If missing entirely:
  - [ ] Add prominent "Add Firefighter" button
  - [ ] Place in roster header
  - [ ] Make visible to admins
- [ ] Update help documentation
- [ ] Test button visibility in all modes

---

### 19. Fix Name Truncation in Roster
**Impact:** Full names not visible
**Effort:** 4 hours

**Subtasks:**
- [ ] Review current truncation logic
  - [ ] Check Tailwind truncate classes
  - [ ] Measure available space
  - [ ] Test with long names (e.g., "Christopher Richardson")
- [ ] Implement tooltips
  - [ ] Use existing `Tooltip` component
  - [ ] Add to `FirefighterItem.tsx`
  - [ ] Show full name on hover
  - [ ] Add long-press for mobile
- [ ] Improve truncation strategy
  - [ ] Keep full first name
  - [ ] Abbreviate middle name
  - [ ] Keep full last name
  - [ ] Example: "Christopher M. Richardson" not "Chris..."
- [ ] Add expand-on-tap for mobile
  - [ ] Modal or inline expansion
  - [ ] Show full details
  - [ ] Easy to dismiss
- [ ] Test with various name lengths
- [ ] Ensure accessibility with screen readers

**Files to Modify:**
- `src/components/FirefighterItem.tsx`
- `src/components/FirefighterList.tsx`
- `src/utils/calendarUtils.ts` (formatCalendarName function)

---

### 20. Implement Comprehensive Input Validation
**Impact:** Prevent invalid data entry
**Effort:** 1 week

**Subtasks:**
- [ ] Create validation utility functions
  - [ ] `validateShift(shift: string): boolean`
  - [ ] `validateDate(date: string): boolean`
  - [ ] `validateStation(station: string): boolean`
  - [ ] `validateFirefighterName(name: string): boolean`
- [ ] Add client-side validation
  - [ ] Form validation for AddFirefighterForm
  - [ ] Date picker validation
  - [ ] Station number validation (1-99)
  - [ ] Required field validation
- [ ] Add validation error messages
  - [ ] Clear, actionable messages
  - [ ] Field-specific errors
  - [ ] Visual error indicators
- [ ] Sanitize inputs
  - [ ] Trim whitespace
  - [ ] Remove special characters where needed
  - [ ] Prevent SQL injection
  - [ ] Prevent XSS
- [ ] Add server-side validation
  - [ ] Edge Function validation
  - [ ] Database constraints
  - [ ] Supabase triggers
- [ ] Test validation
  - [ ] Valid inputs pass
  - [ ] Invalid inputs rejected
  - [ ] Error messages clear
  - [ ] Edge cases handled

**New Files:**
- `src/utils/validation.ts` (already exists, expand it)

---

### 21. Review Database Indexes
**Impact:** Query performance at scale
**Effort:** 4 hours

**Subtasks:**
- [ ] Access Supabase SQL editor
- [ ] Review existing indexes
  ```sql
  SELECT tablename, indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = 'public';
  ```
- [ ] Identify missing indexes
  - [ ] `firefighters(shift, is_active, order_position)`
  - [ ] `firefighters(is_available, order_position)`
  - [ ] `scheduled_holds(shift, hold_date)`
  - [ ] `scheduled_holds(status, hold_date)`
  - [ ] `activity_log(shift, created_at DESC)`
- [ ] Create missing indexes
  ```sql
  CREATE INDEX idx_firefighters_shift_active_position
  ON firefighters(shift, is_active, order_position)
  WHERE is_active = true;
  ```
- [ ] Test query performance
  - [ ] EXPLAIN ANALYZE queries
  - [ ] Measure before/after
  - [ ] Test with larger datasets
- [ ] Document indexing strategy
- [ ] Add indexes to migration scripts

---

### 22. Implement Roster Pagination
**Impact:** Performance with large rosters
**Effort:** 1 week

**Subtasks:**
- [ ] Determine pagination strategy
  - [ ] Items per page (default: 50)
  - [ ] Infinite scroll vs. page numbers
  - [ ] Virtual scrolling for performance
- [ ] Update Supabase queries
  - [ ] Add `.range(start, end)` to queries
  - [ ] Implement cursor-based pagination
  - [ ] Count total results
- [ ] Create Pagination component
  - [ ] Page number buttons
  - [ ] Next/Previous buttons
  - [ ] Jump to page input
  - [ ] Results count display
- [ ] Update FirefighterList
  - [ ] Integrate pagination
  - [ ] Maintain search with pagination
  - [ ] Reset page on search change
- [ ] Add URL state for page number
  - [ ] Update URL with ?page=2
  - [ ] Restore page on refresh
  - [ ] Share paginated links
- [ ] Test with 100+ firefighters
- [ ] Add loading states for page changes
- [ ] Ensure accessibility

**New Files:**
- `src/components/Pagination.tsx`

---

### 23. Add Feature Flags System
**Impact:** Gradual feature rollout
**Effort:** 1 day

**Subtasks:**
- [ ] Choose feature flag approach
  - [ ] Environment variables
  - [ ] LaunchDarkly integration
  - [ ] Custom implementation
- [ ] Create feature flags configuration
  ```tsx
  export const features = {
    realtime: import.meta.env.VITE_FEATURE_REALTIME !== 'false',
    exportData: import.meta.env.VITE_FEATURE_EXPORT !== 'false',
    adminMode: import.meta.env.VITE_FEATURE_ADMIN !== 'false',
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
  };
  ```
- [ ] Create `useFeatureFlag` hook
- [ ] Wrap features with flags
  - [ ] Real-time subscriptions
  - [ ] Admin mode
  - [ ] Export functionality
  - [ ] Analytics tracking
- [ ] Add admin UI to toggle flags
- [ ] Document available flags
- [ ] Test flag toggling

**New Files:**
- `src/utils/featureFlags.ts`
- `src/hooks/useFeatureFlag.ts`

---

## 🧪 TESTING & VALIDATION (Critical for Quality)

### 24. Run Automated Accessibility Testing
**Effort:** 1 day

**Subtasks:**
- [ ] Install accessibility testing tools
  - [ ] `pnpm add -D axe-core @axe-core/react`
  - [ ] Install axe DevTools browser extension
  - [ ] Install WAVE browser extension
- [ ] Run axe-core in development
  ```tsx
  if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then(axe => {
      axe.default(React, ReactDOM, 1000);
    });
  }
  ```
- [ ] Test each page/view
  - [ ] Calendar view
  - [ ] Roster view
  - [ ] Reports view (if exists)
  - [ ] All modals
- [ ] Fix critical violations
  - [ ] Color contrast issues
  - [ ] Missing ARIA labels
  - [ ] Keyboard navigation problems
  - [ ] Heading hierarchy
- [ ] Run WAVE evaluation
- [ ] Document findings
- [ ] Create remediation plan
- [ ] Re-test after fixes

---

### 25. Comprehensive Cross-Browser Testing
**Effort:** 2 days

**Subtasks:**
- [ ] Set up testing environment
  - [ ] BrowserStack account
  - [ ] Local browser testing
  - [ ] Mobile device emulators
- [ ] Test on Chrome (latest)
  - [ ] Windows
  - [ ] macOS
  - [ ] Linux
- [ ] Test on Firefox (latest)
  - [ ] Windows
  - [ ] macOS
  - [ ] Linux
- [ ] Test on Safari (latest)
  - [ ] macOS
  - [ ] iOS 15+
  - [ ] iPad
- [ ] Test on Edge (latest)
  - [ ] Windows
- [ ] Test on Chrome Android
  - [ ] Android 10+
  - [ ] Various screen sizes
- [ ] Test on Samsung Internet
- [ ] Document browser-specific issues
- [ ] Fix compatibility problems
- [ ] Add browser support documentation

**Issues to Watch For:**
- WebSocket support
- Service Worker behavior
- CSS Grid layout
- Flexbox quirks
- Date input formats
- Gesture support

---

### 26. Run Lighthouse Performance Audit
**Effort:** 4 hours

**Subtasks:**
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Run on production URL
- [ ] Run on mobile simulation
- [ ] Run on desktop
- [ ] Analyze Performance score
  - [ ] Target: 90+
  - [ ] Review opportunities
  - [ ] Review diagnostics
- [ ] Analyze Accessibility score
  - [ ] Target: 95+
  - [ ] Fix violations
- [ ] Analyze Best Practices score
  - [ ] Target: 100
  - [ ] Fix issues
- [ ] Analyze SEO score
  - [ ] Target: 100
  - [ ] Add meta descriptions
  - [ ] Fix crawlability
- [ ] Analyze PWA score
  - [ ] Target: 100
  - [ ] Fix PWA requirements
- [ ] Create performance baseline
- [ ] Document improvements
- [ ] Set up CI/CD Lighthouse checks

---

### 27. Test PWA Offline Functionality
**Effort:** 1 day

**Subtasks:**
- [ ] Review service worker code
  - [ ] Check caching strategy
  - [ ] Verify network-first for API
  - [ ] Verify cache-first for assets
- [ ] Test offline mode
  - [ ] Open app online
  - [ ] Go offline (DevTools)
  - [ ] Refresh page
  - [ ] Verify app loads
  - [ ] Test cached features
- [ ] Test "Add to Home Screen"
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Desktop Chrome
- [ ] Test app updates
  - [ ] Deploy new version
  - [ ] Verify update notification
  - [ ] Test "skip waiting"
- [ ] Test offline data modifications
  - [ ] Queue writes
  - [ ] Sync when online
  - [ ] Conflict resolution
- [ ] Document offline capabilities
- [ ] Add offline indicator UI

---

### 28. Test on Actual Mobile Devices
**Effort:** 2 days

**Subtasks:**
- [ ] Test on iPhone
  - [ ] iPhone SE (small screen)
  - [ ] iPhone 13 (standard)
  - [ ] iPhone 13 Pro Max (large)
- [ ] Test on iPad
  - [ ] iPad Mini
  - [ ] iPad Pro
- [ ] Test on Android phones
  - [ ] Pixel 6
  - [ ] Samsung Galaxy S21
  - [ ] Budget Android device
- [ ] Test on Android tablets
  - [ ] Samsung Galaxy Tab
- [ ] Test on ruggedized firefighter tablets
- [ ] Test touch interactions
  - [ ] Tap targets
  - [ ] Swipe gestures
  - [ ] Long press
  - [ ] Pinch to zoom
- [ ] Test in sunlight (if possible)
- [ ] Test with gloves (firefighter scenario)
- [ ] Document device-specific issues

---

### 29. Test with Network Throttling
**Effort:** 4 hours

**Subtasks:**
- [ ] Test with Chrome DevTools throttling
- [ ] Test "Slow 3G" profile
  - [ ] 400ms latency
  - [ ] 400 Kbps download
  - [ ] 400 Kbps upload
- [ ] Test "Fast 3G" profile
  - [ ] 562.5 Kbps download
  - [ ] 562.5 Kbps upload
- [ ] Test "Slow 4G" profile
- [ ] Test "Offline" mode
- [ ] Test intermittent connectivity
  - [ ] Toggle offline/online
  - [ ] Verify reconnection
  - [ ] Test data sync
- [ ] Measure performance impact
  - [ ] LCP on slow connection
  - [ ] FCP on slow connection
  - [ ] TTI on slow connection
- [ ] Optimize for slow networks
  - [ ] Reduce payload sizes
  - [ ] Implement progressive loading
  - [ ] Show loading indicators

---

### 30. Test Edge Cases
**Effort:** 1 week

**Subtasks:**
- [ ] Test concurrent edits
  - [ ] Two users schedule same date
  - [ ] Verify conflict detection
  - [ ] Test resolution strategy
- [ ] Test shift overlap scenarios
  - [ ] Firefighter scheduled on multiple shifts same day
  - [ ] Verify validation
  - [ ] Test error handling
- [ ] Test invalid dates
  - [ ] Future dates beyond 1 year
  - [ ] Past dates beyond 1 year
  - [ ] February 29 on non-leap year
  - [ ] Invalid date formats
- [ ] Test empty shift
  - [ ] Shift with zero firefighters
  - [ ] Verify empty state
  - [ ] Test adding first firefighter
- [ ] Test long names
  - [ ] Names with 50+ characters
  - [ ] Names with special characters (O'Brien, José)
  - [ ] Names with accents and umlauts
- [ ] Test large roster
  - [ ] 100+ firefighters
  - [ ] Performance implications
  - [ ] Pagination behavior
- [ ] Test year boundaries
  - [ ] December → January transition
  - [ ] Hold scheduled on Dec 31
  - [ ] Leap year handling
- [ ] Test rapid actions
  - [ ] Multiple clicks
  - [ ] Race conditions
  - [ ] Optimistic update failures

---

### 31. Test with Screen Readers
**Effort:** 1 day

**Subtasks:**
- [ ] Test with VoiceOver (macOS/iOS)
  - [ ] Navigate calendar
  - [ ] Schedule a hold
  - [ ] Search roster
  - [ ] Open modals
  - [ ] Verify announcements
- [ ] Test with NVDA (Windows)
  - [ ] Same test scenarios
  - [ ] Verify different behavior
- [ ] Test with JAWS (Windows)
  - [ ] Same test scenarios
- [ ] Document screen reader issues
- [ ] Fix ARIA label problems
- [ ] Improve announcement timing
- [ ] Test live region updates
- [ ] Verify focus management

---

## 🔵 LOW PRIORITY (Future Enhancements)

### 32. Implement Fallback Polling
**Effort:** 1 week

**Subtasks:**
- [ ] Create polling utility
- [ ] Detect WebSocket failure
- [ ] Start polling on failure
- [ ] Poll every 30 seconds
- [ ] Compare data for changes
- [ ] Update UI on changes
- [ ] Stop polling when WebSocket reconnects
- [ ] Add polling indicator
- [ ] Test polling behavior

---

### 33-44. Additional Low Priority Tasks
(Due to length constraints, these are summarized. Full breakdown available upon request.)

33. **Code Splitting** - Lazy load routes
34. **Lazy Load Modals** - Dynamic imports
35. **Analytics/Telemetry** - Track usage
36. **CSV Export** - Download roster data
37. **PDF Reports** - Generate reports
38. **iCal Integration** - Calendar sync
39. **Analytics Dashboard** - Metrics visualization
40. **Virtual Scrolling** - Performance for long lists
41. **Swipe Gestures** - Mobile navigation
42. **CORS Policy Review** - Security hardening
43. **Multi-tenancy** - Multiple departments
44. **Advanced Search** - Query builder

---

## 📊 SUMMARY STATISTICS

**Breakdown by Priority:**
- 🔴 Critical: 5 tasks (21 subtasks)
- 🟠 High: 9 tasks (67 subtasks)
- 🟡 Medium: 9 tasks (48 subtasks)
- 🧪 Testing: 8 tasks (44 subtasks)
- 🔵 Low: 13 tasks (~60 subtasks)

**Total:** 44 major tasks, 240+ subtasks

**Completion Status:**
- ✓ Completed: 8 tasks
- 🚧 In Progress: 0 tasks
- ⏳ Pending: 36 tasks

**Estimated Timeline:**
- Critical: 1-2 weeks
- High Priority: 4-6 weeks
- Medium Priority: 4-6 weeks
- Testing: 2-3 weeks
- Low Priority: 6-8 weeks

**Total Project Timeline: 12-15 weeks** (with parallel work)

---

## 🎯 RECOMMENDED SPRINT PLAN

### Sprint 1 (Week 1-2): Critical Fixes ✓ MOSTLY DONE
- [x] Fix WebSocket API key
- [x] Add retry limits
- [x] Add error notifications
- [ ] Add connection status indicator
- [ ] Audit RLS policies

### Sprint 2 (Week 3-4): High Priority UX
- [ ] Fix future date scheduling
- [ ] Optimize mobile calendar
- [ ] Implement error logging
- [ ] Add confirmation dialogs

### Sprint 3 (Week 5-6): Data & Performance
- [ ] React Query implementation
- [ ] Database indexes
- [ ] Roster pagination
- [ ] Input validation

### Sprint 4 (Week 7-8): Comprehensive Testing
- [ ] Accessibility testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Edge case testing

### Sprint 5 (Week 9-10): Polish & Enhancement
- [ ] Station search
- [ ] Name truncation fixes
- [ ] Feature flags
- [ ] Tooltips and help text

### Sprint 6+ (Week 11-15): Low Priority Features
- [ ] Export functionality
- [ ] Analytics dashboard
- [ ] Advanced features
- [ ] Code splitting

---

*Document created: January 31, 2025*
*Based on: Audit Report #1 (Original) + Audit Report #2 (Comprehensive)*
*Total effort: 12-15 weeks with 2-3 developers working in parallel*
